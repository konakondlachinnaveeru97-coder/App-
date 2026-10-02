import crypto from 'node:crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getTracking } from './tracking.js';

export const TAX_RATE = 0.05;
export const ORDER_ID_RE = /^SB\d{6}$/;
const MAX_ITEMS = 20;
const MAX_QTY = 50;

export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function normalizeOrderId(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function newOrderId() {
  return `SB${crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')}`;
}

// Validate the requested items and merge duplicates. Prices are never taken from the client.
export function parseItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'Your cart is empty');
  }
  if (items.length > MAX_ITEMS) throw new HttpError(400, 'Too many different items');
  const merged = new Map();
  for (const item of items) {
    const id = item?.productId;
    const qty = item?.quantity;
    if (typeof id !== 'string' || !id) throw new HttpError(400, 'Each item needs a productId');
    if (!Number.isInteger(qty) || qty < 1) throw new HttpError(400, 'Quantity must be a positive whole number');
    merged.set(id, (merged.get(id) || 0) + qty);
  }
  for (const [id, qty] of merged) {
    if (qty > MAX_QTY) throw new HttpError(400, `You can order at most ${MAX_QTY} of one item`, { [id]: 'quantity' });
  }
  return merged;
}

export function priceOrder(lines) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = 0;
  return { subtotal, tax, deliveryFee, total: subtotal + tax + deliveryFee };
}

export async function createOrder(items) {
  const quantities = parseItems(items);
  const products = await Product.find({ slug: { $in: [...quantities.keys()] }, available: true }).lean();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const missing = [...quantities.keys()].filter((slug) => !bySlug.has(slug));
  if (missing.length) throw new HttpError(400, 'Some items are no longer available', { missing });

  const lines = [...quantities].map(([slug, quantity]) => {
    const p = bySlug.get(slug);
    return { slug, name: p.name, region: p.region, image: p.image, price: p.price, quantity };
  });

  // Retry on the rare order ID collision (duplicate key error 11000).
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const order = await Order.create({ orderId: newOrderId(), items: lines, ...priceOrder(lines) });
      return order.toObject();
    } catch (err) {
      if (err?.code !== 11000) throw err;
    }
  }
  throw new HttpError(500, 'Could not create order, please try again');
}

export async function findOrder(orderId) {
  return Order.findOne({ orderId: normalizeOrderId(orderId) }).lean();
}

export function toPublicOrder(order, now = new Date()) {
  return {
    orderId: order.orderId,
    items: order.items.map(({ slug, name, region, image, price, quantity }) => ({
      id: slug, name, region, image, price, quantity,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    total: order.total,
    createdAt: new Date(order.createdAt).toISOString(),
    tracking: getTracking(order.createdAt, now),
  };
}
