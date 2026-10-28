// Cliente del Apps Script de agenda (apps-script-agenda.gs). La URL y la clave
// viven solo en Vercel: el repo es público y ese script tiene acceso a los calendarios.
async function callAgenda(action, payload, timeoutMs = 25000) {
  const url = process.env.AGENDA_SCRIPT_URL, secret = process.env.AGENDA_SECRET;
  if (!url || !secret) throw new Error('agenda_not_configured');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, action, secret }),
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) throw new Error('agenda_http_' + response.status);
  return response.json();
}

module.exports = { callAgenda };
