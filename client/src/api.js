const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw new Error('We couldn’t reach the bakery. Check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.errors = body.errors;
    throw err;
  }
  return body;
}

export const getProducts = () => request('/api/products').then((b) => b.products);
export const placeOrder = (items) =>
  request('/api/orders', { method: 'POST', body: JSON.stringify({ items }) }).then((b) => b.order);
export const getOrder = (orderId) => request(`/api/orders/${encodeURIComponent(orderId)}`).then((b) => b.order);
export const askAssistant = (message) =>
  request('/api/assistant', { method: 'POST', body: JSON.stringify({ message }) });
