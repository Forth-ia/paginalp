const { readBody, EMAIL_RE } = require('./_lib/lead.js');
const { callAgenda } = require('./_lib/agenda.js');

// Pop-up "¿Te mando más ideas como esta?" del sitio (assets/js/site.js):
// el lead va a "ManyChat - Orgánicos" del Sheets central para alimentarlo.
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
  try {
    const result = await callAgenda('organico', {
      nombre, email, telefono, fuente: 'Pop-up · ' + origen, recurso: origen.replace(/^Recurso: /, '')
    });
    if (!result.ok) throw new Error(result.error);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('popup_lead_failed', { error: error.message });
    return res.status(502).json({ ok: false });
  }
};
