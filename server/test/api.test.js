import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const offline = createApp({ dbReady: () => false, clientDist: '/nonexistent' });

test('GET /api/health reports status', async () => {
  const res = await request(offline).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok', database: 'disconnected' });
});

test('GET /api/content falls back to bundled content without a DB', async () => {
  const res = await request(offline).get('/api/content');
  assert.equal(res.status, 200);
  assert.equal(res.body.source, 'default');
  assert.ok(res.body.brand.name);
  assert.ok(Array.isArray(res.body.nav));
});

test('POST /api/contact validates input', async () => {
  const res = await request(offline).post('/api/contact').send({ name: '', email: 'bad', message: 'short' });
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'message', 'name']);
});

test('POST /api/contact returns 503 when the DB is down', async () => {
  const res = await request(offline)
    .post('/api/contact')
    .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello there, I have a project.' });
  assert.equal(res.status, 503);
});

test('POST /api/subscribe validates email', async () => {
  const res = await request(offline).post('/api/subscribe').send({ email: 'nope' });
  assert.equal(res.status, 400);
});

test('malformed JSON returns 400', async () => {
  const res = await request(offline).post('/api/contact').set('Content-Type', 'application/json').send('{bad');
  assert.equal(res.status, 400);
});

test('unknown API routes return 404', async () => {
  const res = await request(offline).get('/api/nope');
  assert.equal(res.status, 404);
});
