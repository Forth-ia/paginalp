const { queryParam, readBody, parseContact, COUNTRIES } = require('./_lib/lead.js');
const { sendEvent } = require('./_lib/meta.js');
const { callAgenda } = require('./_lib/agenda.js');
const { runAfterResponse } = require('./_lib/after.js');
const { readToken } = require('./_lib/booking-link.js');

// GET: horarios libres de los closers. POST: agenda la llamada de un lead calificado (/aprende)
// o de quien llega con su link personal de agendar (/agendar/?t=…, lo manda el agente de WhatsApp).
module.exports = async function (req, res) {
  if (req.method === 'GET') {
    try {
      // ?p=1: lead prioritario, solo horarios del closer principal.
      const result = await callAgenda('horarios', { prioridad: queryParam(req, 'p') === '1' });
      if (!result.ok) throw new Error(result.error);
      // El CDN de Vercel la sirve sin esperar a Apps Script (1-3 s por consulta). Si un horario
      // ya se ocupó, agendar responde 409 y la página recarga los horarios.
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
      return res.status(200).json({ ok: true, slots: result.slots, duracion: result.duracion });
    } catch (error) {
      console.error('aprende_agenda_slots_failed', { error: error.message });
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ ok: false });
    }
  }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false });
  }
  const data = readBody(req);
  const directo = Boolean(data && data.t);
  const lead = directo ? directLead(data) : parseContact(data);
  const inicio = data && typeof data.inicio === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(data.inicio) ? data.inicio : '';
  if (!lead) return res.status(400).json({ ok: false, error: directo ? 'link' : undefined });
  if (!inicio) return res.status(400).json({ ok: false });

  let result;
  try {
    // El script revisa que el lead esté calificado (o que venga con su link) y que el horario siga libre.
    result = await callAgenda('agendar', { email: lead.email, inicio, evento_meta: 'Schedule', avisos_aparte: true, directo }, 40000);
  } catch (error) {
    console.error('aprende_agenda_book_failed', { error: error.message });
    return res.status(502).json({ ok: false });
  }
  if (!result.ok) return res.status(result.error === 'no_disponible' ? 409 : 400).json({ ok: false, error: result.error });
  // Con el link, la página saluda con el nombre del Sheets.
  const nombre = directo && result.nombre ? { nombre: result.nombre } : {};
  if (result.ya_agendado) return res.status(200).json({ ok: true, ya_agendado: true, cita: result.cita, ...nombre });
  // Con el link solo llega el email: el nombre y el WhatsApp para Meta salen del Sheets.
  if (directo) { lead.nombre = result.nombre || ''; lead.telefonoMeta = phoneForMeta(result.telefono, result.pais); }
  // El lead ve su confirmación ya; Meta y los correos (closer y lead) salen justo después.
  const followUp = () => Promise.allSettled([
    sendEvent({
      name: 'Schedule', id: lead.event_id, req, url: lead.source_url,
      person: { email: lead.email, nombre: lead.nombre, telefonoMeta: lead.telefonoMeta, fbp: lead.fbp, fbc: lead.fbc },
      custom: { content_name: directo ? 'agendar' : 'aprende' }
    }).catch(error => console.error('aprende_agenda_meta_failed', { error: error.message })),
    callAgenda('avisar_cita', { email: lead.email }).catch(error => console.error('aprende_agenda_mail_failed', { error: error.message }))
  ]);
  if (!runAfterResponse(followUp)) await followUp();
  return res.status(200).json({ ok: true, cita: result.cita, ...nombre });
};

// El Sheets guarda el WhatsApp de /aprende sin indicativo (con su País) y el del pop-up con él.
function phoneForMeta(telefono, pais) {
  const digits = String(telefono || '').replace(/\D/g, '');
  const country = COUNTRIES.find(c => c[0] === pais);
  return country && digits.length <= 10 ? country[1] + digits : digits;
}

function directLead(data) {
  const email = readToken(data.t);
  if (!email) return null;
  return {
    email,
    event_id: /^[\w-]{8,80}$/.test(data.event_id) ? data.event_id : 'schedule-' + Date.now().toString(36),
    source_url: /^https:\/\/(www\.)?lucianomusella\.com\//.test(data.source_url) ? String(data.source_url).slice(0, 500) : '',
    fbp: /^fb\.\d\.\d+\.\d+$/.test(data.fbp) ? data.fbp : '',
    fbc: /^fb\.\d\.\d+\.[\w-]+$/.test(data.fbc) ? String(data.fbc).slice(0, 500) : ''
  };
}
