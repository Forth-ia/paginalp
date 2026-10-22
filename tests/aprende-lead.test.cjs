const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { qualify } = require('../assets/js/aprende-qualify.js');
const handler = require('../api/aprende-lead.js');

const good = { aplica: 'dueno', inicio: 'ya', inversion: 'listo' };
const valid = {
  ...good, nombre: 'Ana María Pérez', email: 'Ana@Example.com', telefono: '+57 300 000 0000',
  reto: 'Responder correos de clientes', event_id: 'lead-abc12345',
  source_url: 'https://www.lucianomusella.com/aprende?utm_source=fb', fbp: 'fb.1.1700000000000.123456',
  utm: { utm_source: 'fb', utm_campaign: '=HYPERLINK("x")' }
};

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
async function run(body, calls) {
  const original = global.fetch;
  process.env.META_PIXEL_ID = '123'; process.env.META_CAPI_TOKEN = 'token';
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ ok: true }) };
  };
  try {
    const res = response();
    await handler({ method: 'POST', body, headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1', 'user-agent': 'UA' } }, res);
    return res;
  } finally { global.fetch = original; }
}
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

test('qualified lead goes to Meta as Lead with hashed data and to the Web - Aprende sheet', async () => {
  const calls = [];
  const res = await run(valid, calls);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, qualified: true });
  const meta = calls.find(c => c.url.includes('graph.facebook.com'));
  const event = meta.body.data[0];
  assert.equal(event.event_name, 'Lead');
  assert.equal(event.event_id, 'lead-abc12345');
  assert.deepEqual(event.user_data.em, [sha('ana@example.com')]);
  assert.deepEqual(event.user_data.ph, [sha('573000000000')]);
  assert.deepEqual(event.user_data.fn, [sha('ana')]);
  assert.deepEqual(event.user_data.ln, [sha('maría pérez')]);
  assert.equal(event.user_data.client_ip_address, '1.2.3.4');
  assert.equal(JSON.stringify(meta.body).includes('Ana@Example.com'), false);
  const sheet = calls.find(c => c.url.includes('script.google.com')).body;
  assert.equal(sheet.nombre, 'Ana María Pérez');
  assert.equal(sheet.inversion, 'Estoy listo para invertir');
  assert.equal(sheet.utm_campaign, "'=HYPERLINK(\"x\")");
});

test('adds the Colombian country code to 10-digit mobiles', async () => {
  const calls = [];
  await run({ ...valid, telefono: '321 405 6645' }, calls);
  assert.deepEqual(calls[0].body.data[0].user_data.ph, [sha('573214056645')]);
  assert.equal(calls.find(c => c.url.includes('script.google.com')).body.telefono, '573214056645');
  await run({ ...valid, telefono: '+52 55 1234 5678' }, calls);
  assert.deepEqual(calls[2].body.data[0].user_data.ph, [sha('525512345678')]);
});

test('unqualified lead goes to Meta as LeadNoCalificado and never to Sheets', async () => {
  const calls = [];
  const res = await run({ ...valid, inversion: 'no_puede' }, calls);
  assert.deepEqual(res.body, { ok: true, qualified: false });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.data[0].event_name, 'LeadNoCalificado');
});

test('rejects invalid submissions and ignores bots without contacting anyone', async () => {
  const calls = [];
  for (const body of [null, '{', {}, { ...valid, aplica: 'otro' }, { ...valid, reto: '' }, { ...valid, email: 'x' },
    { ...valid, telefono: '123' }, { ...valid, nombre: '=CMD()' }, { ...valid, event_id: 'bad id' }]) {
    const res = await run(body, calls);
    assert.equal(res.statusCode, 400);
  }
  const bot = await run({ ...valid, website: 'spam.com' }, calls);
  assert.equal(bot.statusCode, 200);
  assert.equal(calls.length, 0);
});

test('still answers the visitor when Meta or Sheets fail', async () => {
  const original = global.fetch, originalError = console.error;
  global.fetch = async () => { throw new Error('down'); };
  console.error = () => {};
  try {
    const res = response();
    await handler({ method: 'POST', body: valid, headers: {} }, res);
    assert.deepEqual(res.body, { ok: true, qualified: true });
  } finally { global.fetch = original; console.error = originalError; }
});
