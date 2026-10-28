const crypto = require('node:crypto');

const GRAPH_VERSION = 'v25.0';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

// person: { email, nombre, telefonoMeta, fbp, fbc }. Los eventos de la web llevan
// además IP y navegador; los del panel (system_generated) no ocurren en la web.
function userData(person, req) {
  const email = String(person.email || '').trim().toLowerCase();
  const [first, ...rest] = String(person.nombre || '').trim().toLowerCase().split(/\s+/);
  const data = {
    em: [sha256(email)],
    external_id: [sha256(email)],
    fbp: person.fbp || undefined,
    fbc: person.fbc || undefined
  };
  if (person.telefonoMeta) data.ph = [sha256(person.telefonoMeta)];
  if (first) data.fn = [sha256(first)];
  if (rest.length) data.ln = [sha256(rest.join(' '))];
  if (req) {
    const headers = req.headers || {};
    data.client_ip_address = String(headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim() || undefined;
    data.client_user_agent = headers['user-agent'] || undefined;
  }
  return data;
}

async function sendEvent({ name, id, person, req, url, custom }) {
  const pixel = process.env.META_PIXEL_ID, token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) throw new Error('meta_not_configured');
  const event = {
    event_name: name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: id,
    action_source: req ? 'website' : 'system_generated',
    user_data: userData(person, req),
    custom_data: custom || undefined
  };
  if (req) event.event_source_url = url || 'https://www.lucianomusella.com/aprende';
  const body = { data: [event] };
  // META_TEST_EVENT_CODE solo se define en Vercel durante una prueba en "Probar eventos".
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('meta_http_' + response.status);
}

module.exports = { sendEvent, sha256 };
