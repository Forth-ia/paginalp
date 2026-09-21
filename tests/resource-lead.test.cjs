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

test('retries the Google confirmation without sending the lead twice', async () => {
  const original = global.fetch;
  let posts = 0, gets = 0;
  global.fetch = async (url, options) => {
    if (options.method === 'POST') {
      posts++;
      assert.equal(options.redirect, 'manual');
      return { status: 302, headers: new Headers({ location: 'https://script.googleusercontent.com/macros/echo?test=1' }) };
    }
    gets++;
    assert.equal(url, 'https://script.googleusercontent.com/macros/echo?test=1');
    if (gets === 1) throw new Error('Transient connection failure');
    return { ok: true, json: async () => ({ ok: true }) };
  };
  try {
    const res = response();
    await handler({ method: 'POST', body: valid }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(posts, 1);
    assert.equal(gets, 2);
  } finally { global.fetch = original; }
});
test('keeps the guide locked after exhausted confirmation retries', async () => {
  const original = global.fetch;
  let posts = 0, gets = 0;
  global.fetch = async (_, options) => {
    if (options.method === 'POST') {
      posts++;
      return { status: 302, headers: new Headers({ location: 'https://script.googleusercontent.com/macros/echo?test=1' }) };
    }
    gets++;
    return { ok: false, status: 503 };
  };
  try {
    const res = response();
    await handler({ method: 'POST', body: valid }, res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.code, 'collector_http_503');
    assert.equal(posts, 1);
    assert.equal(gets, 3);
  } finally { global.fetch = original; }
});
test('rejects a redirect outside Google confirmation service', async () => {
  const original = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls++; return { status: 302, headers: new Headers({ location: 'https://accounts.google.com/login' }) }; };
  try {
    const res = response();
    await handler({ method: 'POST', body: valid }, res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.code, 'collector_unexpected_redirect');
    assert.equal(calls, 1);
  } finally { global.fetch = original; }
});

test('attributes Legal leads correctly and opens the Legal guide', async () => {
  const original = global.fetch;
  let sent;
  global.fetch = async (_, options) => { sent = JSON.parse(options.body); return { ok: true, json: async () => ({ ok: true }) }; };
  try {
    const res = response();
    await handler({ method: 'POST', body: { ...valid, resource: 'claude-for-legal', fuente: 'spoofed' } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(sent.fuente, 'ManyChat · Claude for Legal');
    assert.equal(res.body.redirect, '/recursos/claude-for-legal/');
  } finally { global.fetch = original; }
});
test('rejects unknown resources without saving a lead', async () => {
  const original = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; };
  try {
    for (const resource of ['https://example.com', '../other', '', null, 'constructor']) {
      const res = response();
      await handler({ method: 'POST', body: { ...valid, resource } }, res);
      assert.equal(res.statusCode, 400);
    }
    assert.equal(called, false);
  } finally { global.fetch = original; }
});
