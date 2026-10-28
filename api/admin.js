const { readBody, COUNTRIES } = require('./_lib/lead.js');
const { checkPassword, sessionCookie, clearCookie, currentUser } = require('./_lib/auth.js');
const { sendEvent, sha256 } = require('./_lib/meta.js');
const { callAgenda } = require('./_lib/agenda.js');

const CURRENCIES = ['USD', 'COP'];
// Campos que el panel muestra; fbp/fbc se quedan en el servidor.
const VISIBLE = ['email', 'creado', 'nombre', 'telefono', 'pais', 'estado', 'calificado', 'prioridad', 'aplica', 'inicio', 'inversion', 'reto',
  'cita', 'cita_inicio', 'closer', 'meet', 'asistencia', 'venta', 'valor', 'moneda', 'eventos_meta', 'marcado_por',
  'utm_source', 'utm_campaign', 'utm_content'];
const visible = lead => Object.fromEntries(VISIBLE.map(k => [k, lead[k] || '']));

// /api/admin?a=login|logout|me|list|mark
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const action = (req.query && req.query.a) || '';
  // Los POST solo aceptan JSON: junto con la cookie SameSite=Strict, frena envíos desde otros sitios.
  if (req.method === 'POST' && !/^application\/json/.test((req.headers || {})['content-type'] || '')) return res.status(415).json({ ok: false });

  if (action === 'login' && req.method === 'POST') {
    const data = readBody(req) || {};
    const user = checkPassword(data.email, data.password);
    if (!user) return res.status(401).json({ ok: false });
    res.setHeader('Set-Cookie', sessionCookie(user));
    return res.status(200).json({ ok: true, user });
  }
  if (action === 'logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ ok: true });
  }

  const user = currentUser(req);
  if (!user) return res.status(401).json({ ok: false });
  if (action === 'me' && req.method === 'GET') return res.status(200).json({ ok: true, user });

  try {
    if (action === 'list' && req.method === 'GET') {
      const result = await callAgenda('listar', {});
      if (!result.ok) throw new Error(result.error);
      return res.status(200).json({ ok: true, leads: result.leads.map(visible) });
    }
    if (action === 'mark' && req.method === 'POST') return await mark(req, res, user);
  } catch (error) {
    console.error('admin_failed', { action, error: error.message });
    return res.status(502).json({ ok: false });
  }
  return res.status(404).json({ ok: false });
};

// Asistencia -> ShowUp / NoShow. Venta con valor -> Purchase. Todo por servidor
// (system_generated): ocurre en la llamada, no en la web.
async function mark(req, res, user) {
  const data = readBody(req) || {};
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const campos = { marcado_por: user.email };
  let event;
  if (data.asistencia === 'Show' || data.asistencia === 'No show') {
    campos.asistencia = data.asistencia;
    campos.estado = data.asistencia;
    event = { name: data.asistencia === 'Show' ? 'ShowUp' : 'NoShow', id: 'asistencia-' + sha256(email).slice(0, 20) };
  } else if (data.venta === 'Venta') {
    const valor = Number(data.valor);
    const moneda = CURRENCIES.includes(data.moneda) ? data.moneda : '';
    if (!(valor > 0) || valor > 100000000 || !moneda) return res.status(400).json({ ok: false, error: 'valor' });
    Object.assign(campos, { venta: 'Venta', valor, moneda, estado: 'Venta' });
    event = { name: 'Purchase', id: 'purchase-' + sha256(email).slice(0, 20), custom: { value: valor, currency: moneda, content_name: 'programa-ia' } };
  } else if (data.venta === 'No venta') {
    Object.assign(campos, { venta: 'No venta', valor: '', moneda: '', estado: 'No venta' });
  } else {
    return res.status(400).json({ ok: false });
  }
  if (!email) return res.status(400).json({ ok: false });

  const found = await callAgenda('lead', { email });
  if (!found.ok) return res.status(404).json({ ok: false });
  const lead = found.lead;
  let sent;
  if (event) {
    const country = COUNTRIES.find(c => c[0] === lead.pais);
    const telefono = String(lead.telefono || '').replace(/\D/g, '');
    try {
      await sendEvent({
        ...event,
        person: { email, nombre: lead.nombre, telefonoMeta: telefono && country ? country[1] + telefono : telefono, fbp: lead.fbp, fbc: lead.fbc }
      });
      sent = event.name;
    } catch (error) { console.error('admin_meta_failed', { event: event.name, error: error.message }); }
  }
  const result = await callAgenda('marcar', { email, campos, evento_meta: sent });
  if (!result.ok) throw new Error(result.error);
  return res.status(200).json({ ok: true, lead: visible(result.lead), meta: event ? Boolean(sent) : null });
}
