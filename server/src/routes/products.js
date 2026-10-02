import { Router } from 'express';
import { listProducts } from '../services/catalog.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    res.json({ products: await listProducts(req.dbReady) });
  } catch (err) {
    next(err);
  }
});

export default router;
