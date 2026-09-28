import assert from 'node:assert/strict';
import { normalizeIP, getClientIp, parseAllowlist } from '../ip-gate/ip.js';

let pass = 0;
const t = (name, fn) => {
  try {
    fn();
    pass += 1;
    console.log(`  ok  ${name}`);
  } catch (e) {
    console.log(`FAIL  ${name}\n      ${e.message}`);
    process.exitCode = 1;
  }
};

console.log('\nnormalizeIP');
t('plain IPv4', () => assert.equal(normalizeIP('203.0.113.7'), 'v4:203.0.113.7'));
t('IPv4-mapped IPv6 equals its IPv4', () =>
  assert.equal(normalizeIP('::ffff:203.0.113.7'), 'v4:203.0.113.7'));
t('IPv6 compressed == expanded', () =>
  assert.equal(normalizeIP('2001:db8::1'), normalizeIP('2001:0db8:0000:0000:0000:0000:0000:0001')));
t('IPv6 case-insensitive', () =>
  assert.equal(normalizeIP('2001:DB8::1'), normalizeIP('2001:db8::1')));
t('IPv6 zone id stripped', () => assert.equal(normalizeIP('fe80::1%eth0'), normalizeIP('fe80::1')));
t('trims whitespace', () => assert.equal(normalizeIP('  203.0.113.7 '), 'v4:203.0.113.7'));
t('rejects zero-padded octal form', () => assert.equal(normalizeIP('010.1.1.1'), null));
t('rejects out-of-range octet', () => assert.equal(normalizeIP('256.1.1.1'), null));
t('rejects hostname', () => assert.equal(normalizeIP('evil.example.com'), null));
t('rejects XFF injection payload', () => assert.equal(normalizeIP('1.2.3.4, 5.6.7.8'), null));
t('rejects empty', () => assert.equal(normalizeIP(''), null));
t('rejects too many IPv6 groups', () => assert.equal(normalizeIP('1:2:3:4:5:6:7:8:9'), null));

console.log('\ngetClientIp');
const req = (headers, peer) => ({ headers, socket: { remoteAddress: peer } });

t('honours CF-Connecting-IP behind the Render proxy', () => {
  const r = getClientIp(req({ 'cf-connecting-ip': '203.0.113.7' }, '10.21.157.68'));
  assert.equal(r.normalized, 'v4:203.0.113.7');
  assert.equal(r.source, 'cf-connecting-ip');
});

t('IGNORES spoofed X-Forwarded-For (the whole point)', () => {
  const r = getClientIp(
    req({ 'cf-connecting-ip': '198.51.100.9', 'x-forwarded-for': '203.0.113.7' }, '10.21.157.68'),
  );
  assert.equal(r.normalized, 'v4:198.51.100.9', 'must use CF header, never the XFF one');
});

t('rejects forged CF header when peer is a public address', () => {
  const r = getClientIp(req({ 'cf-connecting-ip': '203.0.113.7' }, '45.61.0.1'));
  assert.equal(r.normalized, 'v4:45.61.0.1', 'must fall back to socket peer');
  assert.equal(r.source, 'socket');
});

t('array header takes first value', () => {
  const r = getClientIp(req({ 'cf-connecting-ip': ['203.0.113.7', '9.9.9.9'] }, '10.0.0.5'));
  assert.equal(r.normalized, 'v4:203.0.113.7');
});

t('local dev: 127.0.0.1 counts as internal peer', () => {
  const r = getClientIp(req({}, '::ffff:127.0.0.1'));
  assert.equal(r.viaProxy, true);
  assert.equal(r.normalized, 'v4:127.0.0.1');
});

console.log('\nparseAllowlist');
t('parses comma and space separated', () => {
  const a = parseAllowlist('203.0.113.7, 198.51.100.9  2001:db8::1');
  assert.equal(a.size, 3);
  assert.ok(a.has('v4:203.0.113.7'));
  assert.ok(a.has('v6:2001:0db8:0000:0000:0000:0000:0000:0001'));
});
t('skips comments and blanks', () => assert.equal(parseAllowlist('  # note, , 203.0.113.7 ').size, 1));
t('empty input yields empty set (caller must fail closed)', () => {
  assert.equal(parseAllowlist(undefined).size, 0);
  assert.equal(parseAllowlist('').size, 0);
});

console.log(`\n${pass} assertions passed${process.exitCode ? ' (with failures)' : ''}\n`);
