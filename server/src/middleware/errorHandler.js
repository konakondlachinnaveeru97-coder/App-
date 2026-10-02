export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong. Please try again.' });
}
