import { mock } from 'node:test';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import defaultProducts from '../src/data/products.js';
import { createApp } from '../src/app.js';

// A Mongoose-style query chain that resolves to `value`.
export function query(value) {
  const q = {
    select: () => q,
    sort: () => q,
    lean: () => Promise.resolve(value),
  };
  return q;
}

export const offlineApp = () => createApp({ dbReady: () => false, clientDist: '/nonexistent' });
export const onlineApp = () => createApp({ dbReady: () => true, clientDist: '/nonexistent' });

// Stubs Product and Order with an in-memory store.
export function stubDb({ orders = [] } = {}) {
  const store = [...orders];
  mock.method(Product, 'find', (filter = {}) => {
    const slugs = filter.slug?.$in;
    return query(defaultProducts.filter((p) => !slugs || slugs.includes(p.slug)));
  });
  mock.method(Order, 'create', async (doc) => {
    const saved = { ...doc, createdAt: new Date() };
    store.push(saved);
    return { toObject: () => saved };
  });
  mock.method(Order, 'findOne', (filter) => query(store.find((o) => o.orderId === filter.orderId) || null));
  return store;
}
