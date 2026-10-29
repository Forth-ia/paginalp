const { queryParam, readBody, parseContact } = require('./_lib/lead.js');
const { sendEvent } = require('./_lib/meta.js');
const { callAgenda } = require('./_lib/agenda.js');

// GET: horarios libres de los closers. POST: agenda la llamada de un lead calificado.
module.exports = async function (req, res) {
  if (req.method === 'GET') {
    try {
      // ?p=1: lead prioritario, solo horarios del closer principal.
      const result = await callAgenda('horarios', { prioridad: queryParam(req, 'p') === '1' });
      if (!result.ok) throw new Error(result.error);
      // El CDN de Vercel la sirve unos segundos: el calendario abre más rápido.
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
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
  const lead = parseContact(data);
  const inicio = data && typeof data.inicio === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(data.inicio) ? data.inicio : '';
  if (!lead || !inicio) return res.status(400).json({ ok: false });

  let result;
  try {
    // El script revisa que el lead esté calificado y que el horario siga libre.
    result = await callAgenda('agendar', { email: lead.email, inicio, evento_meta: 'Schedule' }, 40000);
  } catch (error) {
    console.error('aprende_agenda_book_failed', { error: error.message });
    return res.status(502).json({ ok: false });
  }
  if (!result.ok) return res.status(result.error === 'no_disponible' ? 409 : 400).json({ ok: false, error: result.error });
  if (!result.ya_agendado) {
    try {
      await sendEvent({
        name: 'Schedule', id: lead.event_id, req, url: lead.source_url,
        person: { email: lead.email, nombre: lead.nombre, telefonoMeta: lead.telefonoMeta, fbp: lead.fbp, fbc: lead.fbc },
        custom: { content_name: 'aprende' }
      });
    } catch (error) { console.error('aprende_agenda_meta_failed', { error: error.message }); }
  }
  return res.status(200).json({ ok: true, cita: result.cita });
};
