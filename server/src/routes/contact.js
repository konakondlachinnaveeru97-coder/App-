import { Router } from 'express';
import Message from '../models/Message.js';
import { isEmail } from '../middleware/validate.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject = '', message } = req.body || {};
    const errors = {};
    if (typeof name !== 'string' || !name.trim()) errors.name = 'Name is required';
    if (!isEmail(email)) errors.email = 'A valid email is required';
    if (typeof message !== 'string' || message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    if (typeof subject !== 'string') errors.subject = 'Subject must be text';
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors });

    if (!req.dbReady()) {
      return res.status(503).json({ error: 'Database unavailable. Please try again later.' });
    }
    const doc = await Message.create({ name, email, subject, message });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    next(err);
  }
});

export default router;
