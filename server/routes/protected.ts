import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import copilotRoutes from './copilot.js'

const router = Router();

router.get('/ping', requireAuth, (req, res) => {
  res.json({ 
    message: 'pong', 
    userId: req.session.userId,
    user: req.user
  });
});

router.use('/copilot', requireAuth, copilotRoutes)

export default router;
