const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwNEtZuSl_emmSz7hhtYI5w5-9NK3c2IevQv-xvJpJWZmznqtYquydAzTZ0cFDBW2wgvg/exec';
const RESOURCES = new Map([
  ['claude-productivity', 'Claude Productivity'],
  ['claude-for-legal', 'Claude for Legal'],
  ['google-skills-claude', 'Google Skills para Claude'],
  ['linkedin-skills', '11 LinkedIn Skills'],
  ['claude-human-resources', 'Claude for Human Resources']
]);

function collectorError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

async function readConfirmation(response) {
  if (!response.ok) throw collectorError('collector_http_' + response.status);
  let result;
  try { result = await response.json(); }
  catch (_) { throw collectorError('collector_invalid_response'); }
  if (result.ok !== true) throw collectorError('collector_rejected');
}

async function saveLead(data) {
  // Apps Script writes on POST, then redirects to a separate confirmation URL.
  // Retry only the confirmation GET: repeating the POST could duplicate a lead.
  const response = await fetch(LEADS_ENDPOINT, {
    method: 'POST', redirect: 'manual',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    // Google Apps Script can take more than 30 seconds on a cold start.
    // Keep enough time to confirm a saved lead while staying under Vercel's 60s limit.
    body: JSON.stringify(data), signal: AbortSignal.timeout(45000)
  });
  if (![301, 302, 303].includes(response.status)) return readConfirmation(response);
  const location = response.headers.get('location');
  const confirmation = location && new URL(location);
  if (!confirmation || confirmation.protocol !== 'https:' || confirmation.hostname !== 'script.googleusercontent.com') {
    throw collectorError('collector_unexpected_redirect');
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await fetch(confirmation.href, { signal: AbortSignal.timeout(4000) });
      await readConfirmation(result);
      return;
    } catch (error) {
      if (error.code === 'collector_rejected' || attempt === 2) throw error;
    }
  }
}

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
  // Preserve submissions from previously cached Productivity pages.
  const resource = data.resource === undefined ? 'claude-productivity' : data.resource;
  if (!RESOURCES.has(resource)) return res.status(400).json({ ok: false });
  const nombre = data.nombre.trim();
  const email = data.email.trim();
  const telefono = data.telefono.replace(/\D/g, '');
  if (nombre.length < 2 || nombre.length > 120 || /^[=+@-]/.test(nombre) ||
      email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || /^[=+@-]/.test(email) ||
      !/^[+\d\s().-]+$/.test(data.telefono) || telefono.length < 7 || telefono.length > 15) {
    return res.status(400).json({ ok: false });
  }
  try {
    await saveLead({ nombre, email, telefono, fuente: 'ManyChat · ' + RESOURCES.get(resource) });
    return res.status(200).json({ ok: true, redirect: '/recursos/' + resource + '/' });
  } catch (error) {
    const code = error.name === 'TimeoutError' || error.code === 23
      ? 'collector_timeout'
      : (error.code || 'collector_unavailable');
    console.error('resource_lead_failed', { code });
    return res.status(502).json({ ok: false, code });
  }
};
