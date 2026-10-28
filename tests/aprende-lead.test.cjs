const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { qualify } = require('../assets/js/aprende-qualify.js');
const leadHandler = require('../api/aprende-lead.js');
const agendaHandler = require('../api/aprende-agenda.js');
const adminHandler = require('../api/admin.js');
const { hashPassword } = require('../api/_lib/auth.js');

const AGENDA_URL = 'https://script.example/agenda';
Object.assign(process.env, {
  META_PIXEL_ID: '123', META_CAPI_TOKEN: 'token', AGENDA_SCRIPT_URL: AGENDA_URL, AGENDA_SECRET: 's3cret',
  ADMIN_SESSION_SECRET: 'session-secret',
  ADMIN_USERS: JSON.stringify({ 'admin@getforth.ai': { nombre: 'Luciano', hash: hashPassword('clave-larga') } })
});

const good = { aplica: 'dueno', inicio: 'ya', inversion: 'listo' };
const contact = {
  nombre: 'Ana María Pérez', email: 'Ana@Example.com', telefono: '321 405 6645', pais: 'Colombia',
  event_id: 'lead-abc12345', source_url: 'https://www.lucianomusella.com/aprende?utm_source=fb',
  fbp: 'fb.1.1700000000000.123456', utm: { utm_source: 'fb', utm_campaign: 'oct' }
};
const valid = { ...contact, ...good, reto: 'Responder correos de clientes' };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

test('qualifies only leads without disqualifying answers', () => {
  assert.equal(qualify(good), true);
  assert.equal(qualify({ ...good, aplica: 'empleado', inicio: '2_3_meses', inversion: 'organizarme' }), true);
  assert.equal(qualify({ ...good, aplica: 'no_claro' }), false);
  assert.equal(qualify({ ...good, inicio: 'mas_adelante' }), false);
  assert.equal(qualify({ ...good, inicio: 'explorando' }), false);
  assert.equal(qualify({ ...good, inversion: 'no_puede' }), false);
  // "Necesito conocer mejor" solo con urgencia alta.
  assert.equal(qualify({ ...good, inversion: 'conocer_mas', inicio: 'este_mes' }), true);
  assert.equal(qualify({ ...good, inversion: 'conocer_mas', inicio: '2_3_meses' }), false);
  // "Nuevo negocio" solo con disposición a invertir.
  assert.equal(qualify({ ...good, aplica: 'nuevo_negocio', inversion: 'organizarme' }), true);
  assert.equal(qualify({ ...good, aplica: 'nuevo_negocio', inversion: 'conocer_mas' }), false);
});

function response() {
  return { headers: {}, statusCode: 200, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
// Simula Meta y el Apps Script. agenda(action, body) decide la respuesta del script.
async function run(handler, req, agenda = () => ({ ok: true }), meta = () => ({ ok: true })) {
  const original = global.fetch, originalError = console.error;
  const calls = [];
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, body });
    const result = url === AGENDA_URL ? agenda(body.action, body) : meta(body);
    if (result instanceof Error) throw result;
    return { ok: true, json: async () => result };
  };
  console.error = () => {};
  try {
    const res = response();
    await handler({ headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1', 'user-agent': 'UA', 'content-type': 'application/json' }, query: {}, ...req }, res);
    res.calls = calls;
    res.meta = calls.filter(c => c.url.includes('graph.facebook.com')).map(c => c.body.data[0]);
    res.agenda = calls.filter(c => c.url === AGENDA_URL).map(c => c.body);
    return res;
  } finally { global.fetch = original; console.error = originalError; }
}

test('contact step saves the lead and sends FormularioIniciado', async () => {
  const res = await run(leadHandler, { method: 'POST', body: { ...contact, step: 'contacto' } });
  assert.deepEqual(res.body, { ok: true });
  assert.equal(res.meta[0].event_name, 'FormularioIniciado');
  assert.deepEqual(res.meta[0].user_data.ph, [sha('573214056645')]);
  const saved = res.agenda[0];
  assert.equal(saved.action, 'contacto');
  assert.equal(saved.secret, 's3cret');
  assert.equal(saved.email, 'ana@example.com');
  assert.equal(saved.telefono, '3214056645');
  assert.equal(saved.pais, 'Colombia');
});

test('qualified lead goes to Meta as Lead with hashed data and is saved as calificado', async () => {
  const res = await run(leadHandler, { method: 'POST', body: { ...valid, step: 'calificacion' } });
  assert.deepEqual(res.body, { ok: true, qualified: true });
  const event = res.meta[0];
  assert.equal(event.event_name, 'Lead');
  assert.equal(event.event_id, 'lead-abc12345');
  assert.equal(event.action_source, 'website');
  assert.deepEqual(event.user_data.em, [sha('ana@example.com')]);
  assert.deepEqual(event.user_data.fn, [sha('ana')]);
  assert.deepEqual(event.user_data.ln, [sha('maría pérez')]);
  assert.equal(event.user_data.client_ip_address, '1.2.3.4');
  assert.equal(JSON.stringify(res.meta).includes('Ana@Example.com'), false);
  const saved = res.agenda[0];
  assert.equal(saved.action, 'calificacion');
  assert.equal(saved.calificado, true);
  assert.equal(saved.inversion, 'Estoy listo para invertir');
  assert.equal(saved.evento_meta, 'Lead');
});

test('unqualified lead goes to Meta as LeadNoCalificado and is saved as not qualified', async () => {
  const res = await run(leadHandler, { method: 'POST', body: { ...valid, step: 'calificacion', inversion: 'no_puede' } });
  assert.deepEqual(res.body, { ok: true, qualified: false });
  assert.equal(res.meta[0].event_name, 'LeadNoCalificado');
  assert.equal(res.agenda[0].calificado, false);
});

test('keeps the national number and sends Meta the country code', async () => {
  let res = await run(leadHandler, { method: 'POST', body: { ...valid, telefono: '+57 321 405 6645' } });
  assert.deepEqual(res.meta[0].user_data.ph, [sha('573214056645')]);
  assert.equal(res.agenda[0].telefono, '3214056645');
  res = await run(leadHandler, { method: 'POST', body: { ...valid, pais: 'México', telefono: '55 1234 5678' } });
  assert.deepEqual(res.meta[0].user_data.ph, [sha('525512345678')]);
});

test('rejects invalid submissions and ignores bots without contacting anyone', async () => {
  for (const body of [null, '{', {}, { ...valid, aplica: 'otro' }, { ...valid, reto: '' }, { ...valid, email: 'x' },
    { ...valid, telefono: '123' }, { ...valid, nombre: '=CMD()' }, { ...valid, event_id: 'bad id' }, { ...valid, pais: 'Narnia' }]) {
    const res = await run(leadHandler, { method: 'POST', body });
    assert.equal(res.statusCode, 400);
    assert.equal(res.calls.length, 0);
  }
  const bot = await run(leadHandler, { method: 'POST', body: { ...valid, website: 'spam.com' } });
  assert.equal(bot.statusCode, 200);
  assert.equal(bot.calls.length, 0);
});

test('still answers the visitor when Meta and the sheet fail, without recording the event', async () => {
  const res = await run(leadHandler, { method: 'POST', body: valid }, () => new Error('down'), () => new Error('down'));
  assert.deepEqual(res.body, { ok: true, qualified: true });
  assert.equal(res.agenda[0].evento_meta, undefined);
});

test('lists free slots from the agenda script with a short CDN cache', async () => {
  const res = await run(agendaHandler, { method: 'GET' }, () => ({ ok: true, slots: ['2026-11-02T16:00:00.000Z'], duracion: 30 }));
  assert.deepEqual(res.body, { ok: true, slots: ['2026-11-02T16:00:00.000Z'], duracion: 30 });
  assert.match(res.headers['Cache-Control'], /s-maxage=30/);
});

test('books a qualified lead and sends Schedule with the same person data', async () => {
  const cita = { inicio: '2026-11-02T16:00:00.000Z', meet: 'https://meet.google.com/abc', closer: 'Luciano' };
  const res = await run(agendaHandler, { method: 'POST', body: { ...contact, event_id: 'schedule-abc123', inicio: cita.inicio } }, () => ({ ok: true, cita }));
  assert.deepEqual(res.body, { ok: true, cita });
  assert.equal(res.agenda[0].action, 'agendar');
  assert.equal(res.agenda[0].email, 'ana@example.com');
  assert.equal(res.meta[0].event_name, 'Schedule');
  assert.equal(res.meta[0].event_id, 'schedule-abc123');
  assert.deepEqual(res.meta[0].user_data.em, [sha('ana@example.com')]);
});

test('booking a taken slot answers 409 and sends nothing to Meta', async () => {
  const res = await run(agendaHandler, { method: 'POST', body: { ...contact, inicio: '2026-11-02T16:00:00.000Z' } }, () => ({ ok: false, error: 'no_disponible' }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.meta.length, 0);
  const bad = await run(agendaHandler, { method: 'POST', body: { ...contact, inicio: 'mañana' } });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.calls.length, 0);
});

async function login() {
  const res = await run(adminHandler, { method: 'POST', query: { a: 'login' }, body: { email: 'admin@getforth.ai', password: 'clave-larga' } });
  assert.equal(res.statusCode, 200);
  return res.headers['Set-Cookie'].split(';')[0];
}

test('admin requires a valid login and a JSON body', async () => {
  const wrong = await run(adminHandler, { method: 'POST', query: { a: 'login' }, body: { email: 'admin@getforth.ai', password: 'otra' } });
  assert.equal(wrong.statusCode, 401);
  const anon = await run(adminHandler, { method: 'GET', query: { a: 'list' } });
  assert.equal(anon.statusCode, 401);
  const cookie = await login();
  const forged = await run(adminHandler, { method: 'GET', query: { a: 'list' }, headers: { cookie: cookie.slice(0, -2) + 'xx' } });
  assert.equal(forged.statusCode, 401);
  const form = await run(adminHandler, { method: 'POST', query: { a: 'mark' }, headers: { cookie, 'content-type': 'text/plain' }, body: '{}' });
  assert.equal(form.statusCode, 415);
  const list = await run(adminHandler, { method: 'GET', query: { a: 'list' }, headers: { cookie } },
    () => ({ ok: true, leads: [{ email: 'ana@example.com', nombre: 'Ana', fbp: 'fb.1.1.1' }] }));
  assert.equal(list.statusCode, 200);
  assert.equal(list.body.leads[0].nombre, 'Ana');
  assert.equal(list.body.leads[0].fbp, undefined);
});

const stored = { email: 'ana@example.com', nombre: 'Ana Pérez', telefono: '3214056645', pais: 'Colombia', fbp: 'fb.1.1700000000000.123456' };
const agendaForMark = action => (action === 'lead' ? { ok: true, lead: stored } : { ok: true, lead: { ...stored, estado: 'Show' } });

test('marking Show sends ShowUp from the system and records it', async () => {
  const cookie = await login();
  const res = await run(adminHandler, { method: 'POST', query: { a: 'mark' }, headers: { cookie, 'content-type': 'application/json' }, body: { email: 'ana@example.com', asistencia: 'Show' } }, agendaForMark);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.meta, true);
  const event = res.meta[0];
  assert.equal(event.event_name, 'ShowUp');
  assert.equal(event.action_source, 'system_generated');
  assert.equal(event.user_data.client_ip_address, undefined);
  assert.deepEqual(event.user_data.ph, [sha('573214056645')]);
  const marked = res.agenda.find(c => c.action === 'marcar');
  assert.deepEqual(marked.campos, { marcado_por: 'admin@getforth.ai', asistencia: 'Show', estado: 'Show' });
  assert.equal(marked.evento_meta, 'ShowUp');
});

test('a sale needs value and currency and is sent as Purchase', async () => {
  const cookie = await login();
  const headers = { cookie, 'content-type': 'application/json' };
  const missing = await run(adminHandler, { method: 'POST', query: { a: 'mark' }, headers, body: { email: 'ana@example.com', venta: 'Venta', valor: 0, moneda: 'USD' } }, agendaForMark);
  assert.equal(missing.statusCode, 400);
  const res = await run(adminHandler, { method: 'POST', query: { a: 'mark' }, headers, body: { email: 'ana@example.com', venta: 'Venta', valor: 500, moneda: 'USD' } }, agendaForMark);
  assert.equal(res.meta[0].event_name, 'Purchase');
  assert.deepEqual(res.meta[0].custom_data, { value: 500, currency: 'USD', content_name: 'programa-ia' });
  const noSale = await run(adminHandler, { method: 'POST', query: { a: 'mark' }, headers, body: { email: 'ana@example.com', venta: 'No venta' } }, agendaForMark);
  assert.equal(noSale.meta.length, 0);
  assert.equal(noSale.body.meta, null);
});

test('popup leads go to the central sheet as organic leads', async () => {
  const popup = require('../api/popup-lead.js');
  const res = await run(popup, { method: 'POST', body: { nombre: 'Ana', email: 'Ana@Example.com', telefono: '300 000 0000', fuente: 'Recurso: roast-room' } });
  assert.deepEqual(res.body, { ok: true });
  assert.equal(res.agenda[0].action, 'organico');
  assert.equal(res.agenda[0].email, 'ana@example.com');
  assert.equal(res.agenda[0].fuente, 'Pop-up · Recurso: roast-room');
  assert.equal(res.agenda[0].recurso, 'roast-room');
  const bad = await run(popup, { method: 'POST', body: { nombre: 'A', email: 'x', telefono: '1' } });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.calls.length, 0);
});

test('top leads are flagged as priority and get the main closer slots', async () => {
  const { priority } = require('../assets/js/aprende-qualify.js');
  assert.equal(priority(good), true);
  assert.equal(priority({ ...good, inicio: '2_3_meses' }), false);
  assert.equal(priority({ ...good, inversion: 'organizarme' }), false);
  assert.equal(priority({ ...good, aplica: 'no_claro' }), false);
  let res = await run(leadHandler, { method: 'POST', body: valid });
  assert.equal(res.agenda[0].prioridad, true);
  res = await run(leadHandler, { method: 'POST', body: { ...valid, inversion: 'organizarme' } });
  assert.equal(res.agenda[0].prioridad, false);
  res = await run(agendaHandler, { method: 'GET', query: { p: '1' } }, () => ({ ok: true, slots: [] }));
  assert.equal(res.agenda[0].prioridad, true);
  res = await run(agendaHandler, { method: 'GET' }, () => ({ ok: true, slots: [] }));
  assert.equal(res.agenda[0].prioridad, false);
});

test('the contact step records FormularioIniciado in the sheet only when Meta received it', async () => {
  let res = await run(leadHandler, { method: 'POST', body: { ...contact, step: 'contacto' } });
  assert.equal(res.agenda[0].evento_meta, 'FormularioIniciado');
  res = await run(leadHandler, { method: 'POST', body: { ...contact, step: 'contacto' } }, () => ({ ok: true }), () => new Error('down'));
  assert.equal(res.agenda[0].evento_meta, undefined);
});
