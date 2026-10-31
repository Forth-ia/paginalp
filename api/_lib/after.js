// Trabajo que puede seguir después de responder (correos, Meta): Vercel lo deja terminar
// con waitUntil, lo mismo que hace el paquete @vercel/functions. Devuelve false si el
// runtime no lo ofrece (local o tests): ahí quien llama lo espera antes de responder.
function runAfterResponse(task) {
  const context = globalThis[Symbol.for('@vercel/request-context')];
  const ctx = context && typeof context.get === 'function' ? context.get() : null;
  if (!ctx || typeof ctx.waitUntil !== 'function') return false;
  ctx.waitUntil(Promise.resolve().then(task).catch(error => console.error('after_response_failed', { error: error.message })));
  return true;
}

module.exports = { runAfterResponse };
