import net from 'node:net';

const V4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function parseIPv4(value) {
  const m = V4_RE.exec(value);
  if (!m) return null;

  const bytes = [];
  for (let i = 1; i <= 4; i += 1) {
    const raw = m[i];
    // Reject zero-padded octets ("010.1.1.1") so they can never be read as octal.
    if (raw.length > 1 && raw[0] === '0') return null;
    const n = Number(raw);
    if (n > 255) return null;
    bytes.push(n);
  }
  return bytes;
}

function parseIPv6(value) {
  const s = value.split('%')[0];
  if (!s.includes(':')) return null;

  let addr = s;
  if (addr.includes('.')) {
    const idx = addr.lastIndexOf(':');
    const v4 = parseIPv4(addr.slice(idx + 1));
    if (!v4) return null;
    const hi = ((v4[0] << 8) | v4[1]).toString(16);
    const lo = ((v4[2] << 8) | v4[3]).toString(16);
    addr = `${addr.slice(0, idx + 1)}${hi}:${lo}`;
  }

  const halves = addr.split('::');
  if (halves.length > 2) return null;

  const head = halves[0] === '' ? [] : halves[0].split(':');
  const tail = halves.length === 2 && halves[1] !== '' ? halves[1].split(':') : [];

  let groups;
  if (halves.length === 1) {
    if (head.length !== 8) return null;
    groups = head;
  } else {
    const fill = 8 - head.length - tail.length;
    if (fill < 1) return null;
    groups = [...head, ...Array(fill).fill('0'), ...tail];
  }
  if (groups.length !== 8) return null;

  const out = [];
  for (const group of groups) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(group)) return null;
    out.push(parseInt(group, 16));
  }
  return out;
}

/**
 * Collapses every textual spelling of an address to one comparable key, so
 * "2001:db8::1" and "2001:0db8:0000:0000:0000:0000:0000:0001" match instead of
 * failing a naive string compare and locking you out of your own admin panel.
 * Returns null for anything unparseable.
 */
export function normalizeIP(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (net.isIPv4(trimmed)) {
    const b = parseIPv4(trimmed);
    return b ? `v4:${b.join('.')}` : null;
  }

  if (net.isIPv6(trimmed)) {
    const g = parseIPv6(trimmed);
    if (!g) return null;

    // Treat ::ffff:a.b.c.d as the plain IPv4 address it represents.
    if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) {
      return `v4:${g[6] >> 8}.${g[6] & 255}.${g[7] >> 8}.${g[7] & 255}`;
    }
    return `v6:${g.map((x) => x.toString(16).padStart(4, '0')).join(':')}`;
  }

  return null;
}

function isInternalPeer(address) {
  const raw = String(address ?? '').replace(/^::ffff:/i, '');
  if (!raw) return false;

  if (net.isIPv4(raw)) {
    const [a, b] = raw.split('.').map(Number);
    if (a === 127 || a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    return false;
  }

  if (net.isIPv6(raw)) {
    const g = parseIPv6(raw);
    if (!g) return false;
    if (g.slice(0, 7).every((x) => x === 0) && (g[7] === 0 || g[7] === 1)) return true;
    if ((g[0] & 0xfe00) === 0xfc00) return true;
    if ((g[0] & 0xffc0) === 0xfe80) return true;
    return false;
  }

  return false;
}

function firstHeader(value) {
  if (Array.isArray(value)) return value[0];
  return typeof value === 'string' ? value : null;
}

/**
 * Resolves the client IP for allowlist decisions.
 *
 * On Render the chain is: client -> Cloudflare -> Render proxy -> this app.
 * Render's proxy APPENDS to X-Forwarded-For rather than overwriting it, so the
 * leftmost XFF value is whatever the caller sent and is trivially forged with
 * `curl -H 'X-Forwarded-For: 1.2.3.4'`. XFF is therefore never read here.
 *
 * Cloudflare fronts every Render service and overwrites CF-Connecting-IP on each
 * request it handles, so that value is not client-controllable. We only honour
 * it when the immediate TCP peer is an internal address, which proves the
 * request arrived through Render's proxy instead of being dialled straight at
 * the app.
 */
export function getClientIp(req) {
  const peer = String(req.socket?.remoteAddress ?? '');
  const viaProxy = isInternalPeer(peer);
  const cfConnecting = firstHeader(req.headers['cf-connecting-ip']);

  if (viaProxy && cfConnecting) {
    const normalized = normalizeIP(cfConnecting);
    if (normalized) {
      return { ip: cfConnecting.trim(), normalized, source: 'cf-connecting-ip', viaProxy };
    }
  }

  const normalizedPeer = normalizeIP(peer);
  if (normalizedPeer) {
    return { ip: peer.trim(), normalized: normalizedPeer, source: 'socket', viaProxy };
  }

  return { ip: null, normalized: null, source: 'unresolved', viaProxy };
}

export function parseAllowlist(raw) {
  const allowed = new Set();

  for (const entry of String(raw ?? '').split(/[\s,]+/)) {
    const trimmed = entry.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const key = normalizeIP(trimmed);
    if (key) allowed.add(key);
    else console.warn(`[ip-gate] ignoring unparseable allowlist entry: ${trimmed}`);
  }

  return allowed;
}
