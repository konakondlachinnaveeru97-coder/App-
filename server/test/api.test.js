import { afterEach, describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import Order from '../src/models/Order.js';
import { offlineApp, onlineApp, stubDb } from './helpers.js';

afterEach(() => mock.restoreAll());

const sampleOrder = (overrides = {}) => ({
  orderId: 'SB240618',
  items: [{ slug: 'pistachio-baklava', name: 'Pistachio Baklava', region: 'Türkiye', image: 'x', price: 249, quantity: 2 }],
  subtotal: 498, deliveryFee: 0, tax: 25, total: 523,
  createdAt: new Date(Date.now() - 10 * 60 * 1000),
  ...overrides,
});

describe('health and routing', () => {
  test('GET /api/health reports database status', async () => {
    const res = await request(offlineApp()).get('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok', database: 'disconnected' });
  });

  test('unknown API routes return 404', async () => {
    assert.equal((await request(offlineApp()).get('/api/nope')).status, 404);
  });

  test('malformed JSON returns 400', async () => {
    const res = await request(onlineApp()).post('/api/orders').set('Content-Type', 'application/json').send('{bad');
    assert.equal(res.status, 400);
  });
});

describe('GET /api/products', () => {
  test('falls back to the bundled menu without a database', async () => {
    const res = await request(offlineApp()).get('/api/products');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.products.map((p) => p.name), [
      'Parisian Butter Croissant', 'Pistachio Baklava', 'Nordic Cinnamon Swirl', 'Classic Tiramisu',
    ]);
    assert.equal(res.body.products[0].id, 'parisian-butter-croissant');
    assert.equal(res.body.products[0].price, 189);
  });

  test('reads from MongoDB when connected', async () => {
    stubDb();
    const res = await request(onlineApp()).get('/api/products');
    assert.equal(res.status, 200);
    assert.equal(res.body.products.length, 4);
  });
});

describe('POST /api/orders', () => {
  test('returns 503 without a database', async () => {
    const res = await request(offlineApp()).post('/api/orders').send({ items: [{ productId: 'classic-tiramisu', quantity: 1 }] });
    assert.equal(res.status, 503);
  });

  test('rejects an empty cart', async () => {
    stubDb();
    const res = await request(onlineApp()).post('/api/orders').send({ items: [] });
    assert.equal(res.status, 400);
  });

  test('rejects invalid quantities', async () => {
    stubDb();
    for (const quantity of [0, -1, 1.5, '2', 51]) {
      const res = await request(onlineApp()).post('/api/orders').send({ items: [{ productId: 'classic-tiramisu', quantity }] });
      assert.equal(res.status, 400, `quantity ${quantity}`);
    }
  });

  test('rejects unknown products', async () => {
    stubDb();
    const res = await request(onlineApp()).post('/api/orders').send({ items: [{ productId: 'mystery-cake', quantity: 1 }] });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.errors.missing, ['mystery-cake']);
  });

  test('prices orders on the server and merges duplicate lines', async () => {
    const store = stubDb();
    const res = await request(onlineApp()).post('/api/orders').send({
      items: [
        { productId: 'parisian-butter-croissant', quantity: 1, price: 1 },
        { productId: 'pistachio-baklava', quantity: 1 },
        { productId: 'parisian-butter-croissant', quantity: 1 },
      ],
    });
    assert.equal(res.status, 201);
    const { order } = res.body;
    assert.match(order.orderId, /^SB\d{6}$/);
    assert.equal(order.subtotal, 189 * 2 + 249);
    assert.equal(order.tax, Math.round(627 * 0.05));
    assert.equal(order.deliveryFee, 0);
    assert.equal(order.total, 627 + 31);
    assert.equal(order.items.find((i) => i.id === 'parisian-butter-croissant').quantity, 2);
    assert.equal(order.tracking.stage, 'confirmed');
    assert.equal(store.length, 1);
  });

  test('retries when a generated order ID already exists', async () => {
    stubDb();
    let calls = 0;
    Order.create.mock.mockImplementation(async (doc) => {
      calls += 1;
      if (calls === 1) throw Object.assign(new Error('dup'), { code: 11000 });
      return { toObject: () => ({ ...doc, createdAt: new Date() }) };
    });
    const res = await request(onlineApp()).post('/api/orders').send({ items: [{ productId: 'classic-tiramisu', quantity: 1 }] });
    assert.equal(res.status, 201);
    assert.equal(calls, 2);
  });
});

describe('GET /api/orders/:orderId', () => {
  test('validates the order ID format', async () => {
    stubDb();
    assert.equal((await request(onlineApp()).get('/api/orders/hello')).status, 400);
  });

  test('returns 404 for an unknown order', async () => {
    stubDb();
    assert.equal((await request(onlineApp()).get('/api/orders/SB000001')).status, 404);
  });

  test('returns the order with live tracking, case-insensitively', async () => {
    stubDb({ orders: [sampleOrder()] });
    const res = await request(onlineApp()).get('/api/orders/sb240618');
    assert.equal(res.status, 200);
    assert.equal(res.body.order.orderId, 'SB240618');
    assert.equal(res.body.order.tracking.stage, 'baking');
    assert.equal(res.body.order.tracking.headline, 'Your order is being baked');
    assert.deepEqual(res.body.order.tracking.steps.map((s) => s.done), [true, true, false, false]);
  });
});

describe('POST /api/assistant', () => {
  const ask = (message, app = offlineApp()) => request(app).post('/api/assistant').send({ message });

  test('requires a message', async () => {
    assert.equal((await ask('   ')).status, 400);
  });

  test('recommends eggless bakes', async () => {
    const res = await ask('Show me eggless options');
    assert.equal(res.status, 200);
    assert.match(res.body.reply, /Pistachio Baklava and Nordic Cinnamon Swirl are available eggless/);
    assert.equal(res.body.suggestion.id, 'pistachio-baklava');
  });

  test('recommends the bestseller', async () => {
    const res = await ask('What’s your bestseller?');
    assert.match(res.body.reply, /Parisian Butter Croissant/);
    assert.equal(res.body.suggestion.id, 'parisian-butter-croissant');
  });

  test('offers tracking help', async () => {
    const res = await ask('Help me track my order');
    assert.equal(res.body.action.to, '/track');
  });

  test('lists nut-free bakes', async () => {
    const res = await ask('anything nut free?');
    assert.doesNotMatch(res.body.reply, /Baklava/);
    assert.match(res.body.reply, /Croissant/);
  });

  test('looks up an order by ID', async () => {
    stubDb({ orders: [sampleOrder()] });
    const res = await ask('where is sb240618?', onlineApp());
    assert.match(res.body.reply, /Order SB240618: Your order is being baked/);
    assert.equal(res.body.action.to, '/track/SB240618');
  });
});
