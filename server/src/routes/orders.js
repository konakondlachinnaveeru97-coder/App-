import { Router } from 'express';
import { createOrder, findOrder, normalizeOrderId, ORDER_ID_RE, toPublicOrder } from '../services/orders.js';

const router = Router();

const dbUnavailable = (res) => res.status(503).json({ error: 'Ordering is temporarily unavailable. Please try again shortly.' });

router.post('/', async (req, res, next) => {
  try {
    if (!req.dbReady()) return dbUnavailable(res);
    const order = await createOrder(req.body?.items);
    res.status(201).json({ order: toPublicOrder(order) });
  } catch (err) {
    next(err);
  }
});

router.get('/:orderId', async (req, res, next) => {
  try {
    const orderId = normalizeOrderId(req.params.orderId);
    if (!ORDER_ID_RE.test(orderId)) {
      return res.status(400).json({ error: 'Order IDs look like SB240618' });
    }
    if (!req.dbReady()) return dbUnavailable(res);
    const order = await findOrder(orderId);
    if (!order) return res.status(404).json({ error: `We couldn’t find order ${orderId}` });
    res.json({ order: toPublicOrder(order) });
  } catch (err) {
    next(err);
  }
});

export default router;
