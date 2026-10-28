const crypto = require('node:crypto');

const COOKIE = 'ac_admin';
const SESSION_HOURS = 12;
const b64 = buffer => Buffer.from(buffer).toString('base64url');

// ADMIN_USERS (Vercel): {"correo": {"nombre": "...", "hash": "scrypt$<sal>$<hash>"}}
function users() {
  try { return JSON.parse(process.env.ADMIN_USERS || '{}'); } catch (_) { return {}; }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return 'scrypt$' + salt + '$' + crypto.scryptSync(password, salt, 32).toString('hex');
}

function checkPassword(email, password) {
  const user = users()[String(email || '').trim().toLowerCase()];
  if (!user || typeof password !== 'string' || !password) return null;
  const [, salt, expected] = String(user.hash).split('$');
  if (!salt || !expected) return null;
  const actual = crypto.scryptSync(password, salt, 32);
  const ok = actual.length === Buffer.from(expected, 'hex').length && crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
  return ok ? { email: String(email).trim().toLowerCase(), nombre: user.nombre || email } : null;
}

function sign(payload) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('admin_not_configured');
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function sessionCookie(user) {
  const payload = b64(JSON.stringify({ e: user.email, n: user.nombre, x: Date.now() + SESSION_HOURS * 3600000 }));
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
}

const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

function currentUser(req) {
  const match = String((req.headers || {}).cookie || '').match(new RegExp('(?:^|; )' + COOKIE + '=([^;]+)'));
  if (!match) return null;
  const [payload, signature] = match[1].split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch (_) { return null; }
  // Una cuenta eliminada de ADMIN_USERS pierde el acceso aunque tenga sesión.
  if (!data.e || data.x < Date.now() || !users()[data.e]) return null;
  return { email: data.e, nombre: data.n };
}

module.exports = { hashPassword, checkPassword, sessionCookie, clearCookie, currentUser };
