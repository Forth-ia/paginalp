const crypto = require('node:crypto');
const { QUESTIONS, qualify } = require('../assets/js/aprende-qualify.js');

// Apps Script "web-aprende" (apps-script-web-aprende.gs): pestaña "Web - Aprende" del Sheets de leads.
const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwrfBvYgSH4keIFKmxavxg835g_0byNq7aqZap3_0-kfQka0G102dTNGs6C5vNGZWWW/exec';
const GRAPH_VERSION = 'v25.0';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
// Apps Script would evaluate free text starting with these characters as a formula.
const sheetSafe = value => (/^[=+@-]/.test(value) ? "'" + value : value);
const clip = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function userData(lead, req) {
  const headers = req.headers || {};
  const [first, ...rest] = lead.nombre.toLowerCase().split(/\s+/);
  const data = {
    em: [sha256(lead.email.toLowerCase())],
    ph: [sha256(lead.telefono)],
    fn: [sha256(first)],
    external_id: [sha256(lead.email.toLowerCase())],
    client_ip_address: String(headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim() || undefined,
    client_user_agent: headers['user-agent'] || undefined,
    fbp: lead.fbp || undefined,
    fbc: lead.fbc || undefined
  };
  if (rest.length) data.ln = [sha256(rest.join(' '))];
  return data;
}

// Calificado -> Lead (el evento que optimizan las campañas). No calificado -> evento aparte,
// para medir la proporción sin enseñarle a Meta a buscar más leads así.
async function sendToMeta(lead, qualified, req) {
  const pixel = process.env.META_PIXEL_ID, token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) throw new Error('meta_not_configured');
  const event = {
    event_name: qualified ? 'Lead' : 'LeadNoCalificado',
    event_time: Math.floor(Date.now() / 1000),
    event_id: lead.event_id,
    action_source: 'website',
    event_source_url: lead.source_url || 'https://www.lucianomusella.com/aprende',
    user_data: userData(lead, req),
    custom_data: { content_name: 'aprende', lead_status: qualified ? 'calificado' : 'no_calificado' }
  };
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // META_TEST_EVENT_CODE solo se define en Vercel durante una prueba en "Probar eventos".
    body: JSON.stringify(process.env.META_TEST_EVENT_CODE
      ? { data: [event], test_event_code: process.env.META_TEST_EVENT_CODE }
      : { data: [event] }),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('meta_http_' + response.status);
}

async function saveToSheet(lead) {
  const row = {
    nombre: lead.nombre, email: lead.email, telefono: lead.telefono,
    fuente: 'Aprende · Lead calificado',
    aplica: QUESTIONS.aplica.options[lead.aplica],
    inicio: QUESTIONS.inicio.options[lead.inicio],
    inversion: QUESTIONS.inversion.options[lead.inversion],
    reto: sheetSafe(lead.reto)
  };
  UTM_KEYS.forEach(key => { row[key] = sheetSafe(lead.utm[key] || ''); });
  // No se reintenta el POST: repetirlo podría duplicar la fila.
  const response = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok) throw new Error('sheet_http_' + response.status);
  const result = await response.json();
  if (result.ok !== true) throw new Error('sheet_rejected');
}

function parseLead(data) {
  if (!data || typeof data !== 'object') return null;
  const lead = {
    nombre: clip(data.nombre, 120),
    email: clip(data.email, 254),
    telefono: typeof data.telefono === 'string' ? data.telefono.replace(/\D/g, '') : '',
    aplica: data.aplica, inicio: data.inicio, inversion: data.inversion,
    reto: clip(data.reto, 1000),
    event_id: clip(data.event_id, 80),
    source_url: /^https:\/\/(www\.)?lucianomusella\.com\//.test(data.source_url) ? clip(data.source_url, 500) : '',
    fbp: /^fb\.\d\.\d+\.\d+$/.test(data.fbp) ? data.fbp : '',
    fbc: /^fb\.\d\.\d+\.[\w-]+$/.test(data.fbc) ? clip(data.fbc, 500) : '',
    utm: {}
  };
  if (data.utm && typeof data.utm === 'object') UTM_KEYS.forEach(key => { lead.utm[key] = clip(data.utm[key], 200); });
  // Celular colombiano sin indicativo (10 dígitos que empiezan por 3): Meta necesita el 57 para cruzarlo.
  if (/^3\d{9}$/.test(lead.telefono)) lead.telefono = '57' + lead.telefono;
  const valid = lead.nombre.length >= 2 && !/^[=+@-]/.test(lead.nombre) &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email) && !/^[=+@-]/.test(lead.email) &&
    typeof data.telefono === 'string' && /^[+\d\s().-]+$/.test(data.telefono) &&
    lead.telefono.length >= 7 && lead.telefono.length <= 15 &&
    ['aplica', 'inicio', 'inversion'].every(key => Object.prototype.hasOwnProperty.call(QUESTIONS[key].options, lead[key])) &&
    lead.reto.length >= 3 && /^[\w-]{8,80}$/.test(lead.event_id);
  return valid ? lead : null;
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  let data;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (_) {
    return res.status(400).json({ ok: false });
  }
  // Campo trampa invisible: los bots lo llenan, las personas no.
  if (data && data.website) return res.status(200).json({ ok: true, qualified: false });
  const lead = parseLead(data);
  if (!lead) return res.status(400).json({ ok: false });

  const qualified = qualify(lead);
  const [meta, sheet] = await Promise.allSettled([
    sendToMeta(lead, qualified, req),
    qualified ? saveToSheet(lead) : Promise.resolve()
  ]);
  if (meta.status === 'rejected') console.error('aprende_lead_meta_failed', { error: meta.reason.message });
  if (sheet.status === 'rejected') console.error('aprende_lead_sheet_failed', { error: sheet.reason.message });
  return res.status(200).json({ ok: true, qualified });
};
