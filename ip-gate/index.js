import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { getClientIp, parseAllowlist } from './ip.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(here, '..', 'dist');
const decoyPath = path.join(here, 'unavailable.html');

const isProduction = process.env.NODE_ENV === 'production';
const allowlist = parseAllowlist(process.env.ADMIN_ALLOWED_IPS);

// Local-dev escape hatch. Hard-refused in production so it cannot be enabled
// by accident in a deployed environment.
const gateDisabled = process.env.IP_GATE_DISABLED === 'true' && !isProduction;

// "all"   -> the entire site is hidden from unrecognised IPs (default)
// "admin" -> only /admin is hidden, the storefront stays public
const scope = process.env.IP_GATE_SCOPE === 'admin' ? 'admin' : 'all';

if (!fs.existsSync(distDir)) {
  console.error(`[boot] Missing build output at ${distDir}. Run "npm run build" before starting.`);
  process.exit(1);
}

if (allowlist.size === 0 && !gateDisabled) {
  console.error(
    "[ip-gate] ADMIN_ALLOWED_IPS is empty or unparseable - denying every request (fail closed). " +
      "Set it in the Render dashboard to your laptop's public IP.",
  );
}

if (allowlist.size > 0) {
  console.log(`[ip-gate] ${allowlist.size} allowlisted address(es), scope=${scope}.`);
} else if (gateDisabled) {
  console.warn('[ip-gate] DISABLED for local development. Never do this in production.');
}

const app = express();
app.disable('x-powered-by');
// The gate derives IPs itself from the socket plus the Cloudflare header, so
// Express must not also re-derive req.ip from X-Forwarded-For.
app.set('trust proxy', false);

const decoy = fs.readFileSync(decoyPath);

function sendDecoy(req, res) {
  res
    .status(503)
    .set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'Retry-After': '600',
    })
    .send(decoy);
}

// Health check is registered ahead of the gate but only answers Render's own
// probe: a public caller gets the decoy, so the endpoint reveals nothing.
app.get('/healthz', (req, res) => {
  const { viaProxy, ip } = getClientIp(req);
  if (!viaProxy && !isProduction) {
    return res.status(200).type('text/plain').send('ok');
  }
  if (!viaProxy) return sendDecoy(req, res);
  return res.status(200).type('text/plain').send(`ok ${ip ?? 'unknown'}`);
});

app.use((req, res, next) => {
  if (gateDisabled) return next();
  if (scope === 'admin' && !req.path.startsWith('/admin')) return next();

  const { normalized, ip, source } = getClientIp(req);
  if (normalized && allowlist.has(normalized)) return next();

  console.warn(`[ip-gate] denied ${req.method} ${req.path} from ${ip ?? 'unknown'} (${source})`);
  return sendDecoy(req, res);
});

app.use(
  express.static(distDir, {
    index: false,
    maxAge: '1h',
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store, max-age=0');
    },
  }),
);

// SPA fallback, written as middleware rather than a wildcard route so it works
// on both Express 4 and 5 (path-to-regexp v8 rejects a bare "*").
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  return res
    .set('Cache-Control', 'no-store, max-age=0')
    .sendFile(path.join(distDir, 'index.html'));
});

const port = Number(process.env.PORT) || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[boot] flux-store listening on :${port}`);
});
