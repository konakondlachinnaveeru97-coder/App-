import { Router } from 'express';
import Content from '../models/Content.js';
import defaultContent from '../data/siteContent.js';

const router = Router();

// Returns site copy from MongoDB when available, otherwise the bundled defaults,
// so the frontend always renders even before the database is seeded.
router.get('/', async (req, res, next) => {
  try {
    if (req.dbReady()) {
      const doc = await Content.findOne({ key: 'site' }).lean();
      if (doc) return res.json({ source: 'database', ...doc.data });
    }
    res.json({ source: 'default', ...defaultContent });
  } catch (err) {
    next(err);
  }
});

export default router;
