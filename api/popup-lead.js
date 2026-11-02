const { readBody, parseUtm, COUNTRIES, EMAIL_RE } = require('./_lib/lead.js');
const { callAgenda } = require('./_lib/agenda.js');
const { parseAnswers, priority } = require('./_lib/popup-questions.js');

// Pop-up de recursos del sitio (assets/js/site.js), en 2 pasos: el lead va a "ManyChat - Orgánicos"
// del Sheets central. El paso 1 (contacto) llega sin respuestas y queda como "Pop-up incompleto";
// el paso 2 lo completa con las respuestas y la prioridad A/B/C.
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  const data = readBody(req);
  if (!data || typeof data.nombre !== 'string' || typeof data.email !== 'string' || typeof data.telefono !== 'string') {
    return res.status(400).json({ ok: false });
  }
  const nombre = data.nombre.trim().slice(0, 120);
  const email = data.email.trim().toLowerCase();
  const telefono = data.telefono.replace(/\D/g, '');
  // site.js manda "Recursos", "Recurso: <slug>" o "Página Web".
  const origen = typeof data.fuente === 'string' && /^[\w\s:áéíóúñ-]{1,80}$/i.test(data.fuente) ? data.fuente.trim() : 'Página Web';
  if (nombre.length < 2 || /^[=+@-]/.test(nombre) || email.length > 254 || !EMAIL_RE.test(email) ||
      telefono.length < 7 || telefono.length > 15) {
    return res.status(400).json({ ok: false });
  }
  const pais = COUNTRIES.some(c => c[0] === data.pais) ? data.pais : undefined;
  const answers = data.respuestas === undefined ? null : parseAnswers(data.respuestas);
  if (data.respuestas !== undefined && !answers) return res.status(400).json({ ok: false });
  const formulario = answers
    ? { formulario: 'Completo', respuestas: answers.textos, prioridad_popup: priority(answers.valores) }
    : { formulario: 'Incompleto' };
  try {
    const result = await callAgenda('organico', {
      nombre, email, telefono, pais, fuente: 'Pop-up · ' + origen, recurso: origen.replace(/^Recurso: /, ''), utm: parseUtm(data.utm),
      ...formulario
    });
    if (!result.ok) throw new Error(result.error);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('popup_lead_failed', { error: error.message });
    return res.status(502).json({ ok: false });
  }
};
