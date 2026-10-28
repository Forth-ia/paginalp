const { qualify, priority } = require('../assets/js/aprende-qualify.js');
const { readBody, parseContact, addAnswers, answerLabels, sheetFields } = require('./_lib/lead.js');
const { sendEvent } = require('./_lib/meta.js');
const { callAgenda } = require('./_lib/agenda.js');

// Paso "contacto": el lead queda guardado en MAESTRO aunque abandone el formulario.
// Paso "calificacion": calificado -> Lead (lo que optimizan las campañas);
// no calificado -> LeadNoCalificado, solo para medir.
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  const data = readBody(req);
  // Campo trampa invisible: los bots lo llenan, las personas no.
  if (data && data.website) return res.status(200).json({ ok: true, qualified: false });
  const lead = parseContact(data);
  if (!lead) return res.status(400).json({ ok: false });
  const person = { email: lead.email, nombre: lead.nombre, telefonoMeta: lead.telefonoMeta, fbp: lead.fbp, fbc: lead.fbc };
  const meta = { person, req, id: lead.event_id, url: lead.source_url, custom: { content_name: 'aprende' } };

  if (data.step === 'contacto') {
    const [sheet, event] = await Promise.allSettled([
      callAgenda('contacto', sheetFields(lead)).then(r => { if (!r.ok) throw new Error(r.error); }),
      sendEvent({ ...meta, name: 'FormularioIniciado' })
    ]);
    logFailures('contacto', sheet, event);
    return res.status(200).json({ ok: true });
  }

  // Páginas en caché de antes del paso de contacto mandan todo junto, sin "step".
  if (!addAnswers(lead, data)) return res.status(400).json({ ok: false });
  const qualified = qualify(lead);
  const eventName = qualified ? 'Lead' : 'LeadNoCalificado';
  // Meta primero, para dejar anotado en el Sheets si el evento salió.
  const [event] = await Promise.allSettled([
    sendEvent({ ...meta, name: eventName, custom: { content_name: 'aprende', lead_status: qualified ? 'calificado' : 'no_calificado' } })
  ]);
  const [sheet] = await Promise.allSettled([
    callAgenda('calificacion', {
      ...sheetFields(lead), ...answerLabels(lead), reto: lead.reto, calificado: qualified, prioridad: priority(lead),
      evento_meta: event.status === 'fulfilled' ? eventName : undefined
    }).then(r => { if (!r.ok) throw new Error(r.error); })
  ]);
  logFailures('calificacion', event, sheet);
  return res.status(200).json({ ok: true, qualified });
};

function logFailures(step, ...results) {
  results.forEach(r => { if (r.status === 'rejected') console.error('aprende_lead_failed', { step, error: r.reason && r.reason.message }); });
}
