const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwNEtZuSl_emmSz7hhtYI5w5-9NK3c2IevQv-xvJpJWZmznqtYquydAzTZ0cFDBW2wgvg/exec';

// Only confirm access after the existing collector confirms the row was saved.
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
  if (!data || typeof data.nombre !== 'string' || typeof data.email !== 'string' || typeof data.telefono !== 'string') {
    return res.status(400).json({ ok: false });
  }
  const nombre = data.nombre.trim();
  const email = data.email.trim();
  const telefono = data.telefono.replace(/\D/g, '');
  if (nombre.length < 2 || nombre.length > 120 || /^[=+@-]/.test(nombre) ||
      email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || /^[=+@-]/.test(email) ||
      !/^[+\d\s().-]+$/.test(data.telefono) || telefono.length < 7 || telefono.length > 15) {
    return res.status(400).json({ ok: false });
  }
  try {
    const upstream = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nombre, email, telefono, fuente: 'ManyChat · Claude Productivity' }),
      signal: AbortSignal.timeout(20000)
    });
    if (!upstream.ok || (await upstream.json()).ok !== true) throw new Error('Collector did not confirm');
    return res.status(200).json({ ok: true, redirect: '/recursos/claude-productivity/' });
  } catch (_) {
    return res.status(502).json({ ok: false });
  }
};
