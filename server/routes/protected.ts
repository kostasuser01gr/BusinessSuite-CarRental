import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/ping', requireAuth, (req, res) => {
  res.json({ message: 'pong', userId: req.session.userId });
});

export default router;
