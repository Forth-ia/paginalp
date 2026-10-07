const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwNEtZuSl_emmSz7hhtYI5w5-9NK3c2IevQv-xvJpJWZmznqtYquydAzTZ0cFDBW2wgvg/exec';
const RESOURCES = new Map([
  ['claude-maquina-de-leads', 'Convierte Claude en una máquina de leads'],
  ['sales-coach-assistant', 'Sales Coach Assistant'],
  ['everything-claude-code', '63 agentes de AI · ECC'],
  ['skillspector', 'SkillSpector'],
  ['claude-productivity', 'Claude Productivity'],
  ['claude-for-legal', 'Claude for Legal'],
  ['google-skills-claude', 'Google Skills para Claude'],
  ['linkedin-skills', '11 LinkedIn Skills'],
  ['claude-human-resources', 'Claude for Human Resources'],
  ['higgsfield-codex-cli', 'Crea contenido con Higgsfield + Codex CLI'],
  ['claude-code-codex-plugin', 'Claude Code + Codex: Plugin Oficial'],
  ['fable-orquesta-codex-ejecuta', 'Fable orquesta, Codex ejecuta']
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
  catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') throw error;
    throw collectorError('collector_invalid_response');
  }
  if (result.ok !== true) throw collectorError('collector_rejected');
}

async function saveLead(data) {
  const started = Date.now();
  let stage = 'save';
  try {
    // Apps Script writes on POST, then redirects to a separate confirmation URL.
    // Retry only the confirmation GET: repeating the POST could duplicate a lead.
    const response = await fetch(LEADS_ENDPOINT, {
      method: 'POST', redirect: 'manual',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      // Allow cold starts, leaving 27 seconds for confirmation within the 90s limit.
      body: JSON.stringify(data), signal: AbortSignal.timeout(60000)
    });
    if (![301, 302, 303].includes(response.status)) return await readConfirmation(response);
    const location = response.headers.get('location');
    const confirmation = location && new URL(location);
    if (!confirmation || confirmation.protocol !== 'https:' || confirmation.hostname !== 'script.googleusercontent.com') {
      throw collectorError('collector_unexpected_redirect');
    }
    stage = 'confirmation';
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // Do not immediately repeat a transient 404/HTML response from Google.
        if (attempt > 0) await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        const result = await fetch(confirmation.href, {
          cache: 'no-store',
          headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
          signal: AbortSignal.timeout(8000)
        });
        await readConfirmation(result);
        return;
      } catch (error) {
        if (error.code === 'collector_rejected' || attempt === 2) throw error;
      }
    }
  } catch (error) {
    error.stage = stage;
    error.elapsedMs = Date.now() - started;
    throw error;
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
    const code = error.name === 'TimeoutError' || error.name === 'AbortError' || error.code === 23
      ? 'collector_timeout'
      : (error.code || 'collector_unavailable');
    console.error('resource_lead_failed', { code, stage: error.stage, elapsedMs: error.elapsedMs });
    return res.status(502).json({ ok: false, code });
  }
};
