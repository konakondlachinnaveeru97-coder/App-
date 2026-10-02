import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import assistantRoutes from './routes/assistant.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { isDBConnected } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp({ dbReady = isDBConnected, clientOrigin, clientDist } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors(clientOrigin ? { origin: clientOrigin.split(',') } : undefined));
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    req.dbReady = dbReady;
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: dbReady() ? 'connected' : 'disconnected' });
  });
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/assistant', assistantRoutes);
  app.use('/api', notFound);

  // In production the Express server also serves the built React app.
  const dist = clientDist ?? path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
