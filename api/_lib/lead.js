const { QUESTIONS, COUNTRIES } = require('../../assets/js/aprende-qualify.js');

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clip = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function readBody(req) {
  try { return typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch (_) { return undefined; }
}

// Datos de contacto + atribución. null si algo no es válido.
function parseContact(data) {
  if (!data || typeof data !== 'object') return null;
  const lead = {
    nombre: clip(data.nombre, 120),
    email: clip(data.email, 254).toLowerCase(),
    telefono: typeof data.telefono === 'string' ? data.telefono.replace(/\D/g, '') : '',
    pais: '',
    event_id: clip(data.event_id, 80),
    source_url: /^https:\/\/(www\.)?lucianomusella\.com\//.test(data.source_url) ? clip(data.source_url, 500) : '',
    fbp: /^fb\.\d\.\d+\.\d+$/.test(data.fbp) ? data.fbp : '',
    fbc: /^fb\.\d\.\d+\.[\w-]+$/.test(data.fbc) ? clip(data.fbc, 500) : '',
    utm: {}
  };
  if (data.utm && typeof data.utm === 'object') UTM_KEYS.forEach(key => { lead.utm[key] = clip(data.utm[key], 200); });
  // El Sheets guarda el número sin indicativo; Meta lo necesita con el del país elegido.
  // Sin país (página en caché de antes del selector) el número se usa tal como llegó.
  lead.telefonoMeta = lead.telefono;
  if (data.pais !== undefined) {
    const country = COUNTRIES.find(c => c[0] === data.pais);
    if (!country) return null;
    if (lead.telefono.startsWith(country[1]) && lead.telefono.length > 10) lead.telefono = lead.telefono.slice(country[1].length);
    lead.telefonoMeta = country[1] + lead.telefono;
    lead.pais = country[0];
  }
  const valid = lead.nombre.length >= 2 && !/^[=+@-]/.test(lead.nombre) &&
    EMAIL_RE.test(lead.email) && !/^[=+@-]/.test(lead.email) &&
    typeof data.telefono === 'string' && /^[+\d\s().-]+$/.test(data.telefono) &&
    lead.telefono.length >= 6 && lead.telefonoMeta.length <= 15 &&
    /^[\w-]{8,80}$/.test(lead.event_id);
  return valid ? lead : null;
}

// Agrega las respuestas de calificación al lead. false si faltan o no son válidas.
function addAnswers(lead, data) {
  lead.aplica = data.aplica; lead.inicio = data.inicio; lead.inversion = data.inversion;
  lead.reto = clip(data.reto, 1000);
  return ['aplica', 'inicio', 'inversion'].every(key => Object.prototype.hasOwnProperty.call(QUESTIONS[key].options, lead[key])) &&
    lead.reto.length >= 3;
}

const answerLabels = lead => ({
  aplica: QUESTIONS.aplica.options[lead.aplica],
  inicio: QUESTIONS.inicio.options[lead.inicio],
  inversion: QUESTIONS.inversion.options[lead.inversion]
});

// Lo que se guarda en el Sheets (sin event_id ni URL).
const sheetFields = lead => ({
  email: lead.email, nombre: lead.nombre, telefono: lead.telefono, pais: lead.pais,
  fbp: lead.fbp, fbc: lead.fbc, utm: lead.utm
});

module.exports = { readBody, parseContact, addAnswers, answerLabels, sheetFields, COUNTRIES, EMAIL_RE };
