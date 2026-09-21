const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/resource-lead.js');

const valid = { nombre: 'Prueba', email: 'prueba@example.com', telefono: '+57 300 000 0000' };
function response() {
  return { headers: {}, statusCode: 200, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
test('rejects unsupported methods and invalid submissions without contacting the collector', async () => {
  const original = global.fetch;
  global.fetch = () => { throw new Error('Must not contact collector'); };
  try {
    const res = response();
    await handler({ method: 'GET' }, res);
    assert.equal(res.statusCode, 405);
    for (const body of [null, '{', {}, { ...valid, nombre: ' ' }, { ...valid, nombre: '=IMPORTXML()' }, { ...valid, email: 'invalid' }, { ...valid, telefono: '123' }, { ...valid, telefono: 'abc3000000000' }]) {
      const res = response();
      await handler({ method: 'POST', body }, res);
      assert.equal(res.statusCode, 400);
    }
  } finally { global.fetch = original; }
});
test('opens the guide only after confirmed storage and fixes attribution on the server', async () => {
  const original = global.fetch;
  let sent;
  global.fetch = async (_, options) => { sent = JSON.parse(options.body); return { ok: true, json: async () => ({ ok: true }) }; };
  try {
    const res = response();
    await handler({ method: 'POST', body: JSON.stringify({ ...valid, fuente: 'spoofed' }) }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.redirect, '/recursos/claude-productivity/');
    assert.equal(sent.fuente, 'ManyChat · Claude Productivity');
    assert.equal(sent.telefono, '573000000000');
    assert.equal(res.headers['Cache-Control'], 'no-store');
  } finally { global.fetch = original; }
});
test('does not grant access on collector, network or malformed-response failures', async () => {
  const original = global.fetch;
  try {
    for (const failure of [async () => { throw new Error('offline'); }, async () => ({ ok: false }), async () => ({ ok: true, json: async () => ({ ok: false }) }), async () => ({ ok: true, json: async () => { throw new Error('HTML response'); } })]) {
      global.fetch = failure;
      const res = response();
      await handler({ method: 'POST', body: valid }, res);
      assert.equal(res.statusCode, 502);
      assert.equal(res.body.ok, false);
      assert.equal(res.body.redirect, undefined);
    }
  } finally { global.fetch = original; }
});
