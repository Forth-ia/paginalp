// Avisa al agente de WhatsApp (whatsapp-agent-forth) cuando un closer marca la llamada, para que
// reaccione al instante (no-show, venta…). Si falla no pasa nada: el agente lee el Estado de
// "Página - Agendados" cada 5 minutos. La URL y la clave viven solo en Vercel.
async function notifyAgent(email, estado) {
  const url = process.env.WHATSAPP_AGENT_URL, secret = process.env.WHATSAPP_AGENT_SECRET;
  if (!url || !secret || !email || !estado) return false;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ingest-secret': secret },
      body: JSON.stringify({ email, estado }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) console.error('agent_notify_failed', { status: response.status });
    return response.ok;
  } catch (error) {
    console.error('agent_notify_failed', { error: error.message });
    return false;
  }
}

module.exports = { notifyAgent };
