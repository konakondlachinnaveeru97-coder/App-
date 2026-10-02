import { Router } from 'express';
import { listProducts } from '../services/catalog.js';
import { respond } from '../services/assistant.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const message = req.body?.message;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please type a message' });
    }
    if (message.length > 500) return res.status(400).json({ error: 'Message is too long' });
    const products = await listProducts(req.dbReady);
    const result = await respond(message.trim(), { products, dbReady: req.dbReady });
    res.json({ suggestion: null, action: null, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
