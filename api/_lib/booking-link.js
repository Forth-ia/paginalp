const crypto = require('node:crypto');

// Link personal para agendar sin volver a llenar datos: /agendar/?t=<token>. El agente de WhatsApp
// (Forth-Metricas, lib/agente/booking-link.ts) arma el mismo token con AGENDA_LINK_SECRET.
// token = email en base64url + "." + firma HMAC-SHA256 (22 caracteres).
const BASE_URL = 'https://www.lucianomusella.com/agendar/';

function signature(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('base64url').slice(0, 22);
}

function makeToken(email, secret = process.env.AGENDA_LINK_SECRET) {
  if (!secret) throw new Error('AGENDA_LINK_SECRET');
  const clean = String(email).trim().toLowerCase();
  return Buffer.from(clean).toString('base64url') + '.' + signature(clean, secret);
}

// El email del token, o null si el token no es válido.
function readToken(token, secret = process.env.AGENDA_LINK_SECRET) {
  if (!secret || typeof token !== 'string' || token.length > 400) return null;
  const match = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{22})$/.exec(token);
  if (!match) return null;
  const email = Buffer.from(match[1], 'base64url').toString('utf8');
  const expected = Buffer.from(signature(email, secret));
  const given = Buffer.from(match[2]);
  if (!crypto.timingSafeEqual(expected, given)) return null;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null;
}

module.exports = { BASE_URL, makeToken, readToken };
