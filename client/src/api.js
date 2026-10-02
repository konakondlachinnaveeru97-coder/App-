const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.errors = body.errors || {};
    err.status = res.status;
    throw err;
  }
  return body;
}

export const getContent = () => request('/api/content');
export const sendMessage = (data) => request('/api/contact', { method: 'POST', body: JSON.stringify(data) });
export const subscribe = (email) => request('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
