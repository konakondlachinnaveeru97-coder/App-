import { Router } from 'express';
import Subscriber from '../models/Subscriber.js';
import { isEmail } from '../middleware/validate.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!isEmail(email)) {
      return res.status(400).json({ error: 'Validation failed', errors: { email: 'A valid email is required' } });
    }
    if (!req.dbReady()) {
      return res.status(503).json({ error: 'Database unavailable. Please try again later.' });
    }
    // Upsert so subscribing twice is harmless and does not leak whether an email exists.
    await Subscriber.updateOne(
      { email: email.trim().toLowerCase() },
      { $setOnInsert: { email: email.trim().toLowerCase() } },
      { upsert: true }
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
