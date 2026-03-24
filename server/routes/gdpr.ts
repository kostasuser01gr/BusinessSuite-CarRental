import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AuthService } from '../services/auth.service.js';
import { auditLogger } from '../middleware/logging.js';

const router = Router();

router.get(
  '/export',
  requireAuth,
  auditLogger('gdpr.data_export'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const userData = await AuthService.exportUserData(userId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.json"`);
    res.json(userData);
  })
);

router.post(
  '/delete-account',
  requireAuth,
  auditLogger('gdpr.account_deletion'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session.userId!;

    await AuthService.softDeleteUser(userId);

    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: 'Account deleted but session cleanup failed' });
      }
      res.clearCookie('adaptive_sid');
      res.json({ message: 'Account successfully deleted' });
    });
  })
);

router.get(
  '/privacy-policy',
  (_req, res) => {
    res.json({
      lastUpdated: '2026-03-24',
      summary: 'We collect only necessary data and respect your privacy rights under GDPR.',
      dataCollected: [
        'Email address',
        'Name',
        'Account activity logs',
        'Tasks, notes, and other user-generated content',
      ],
      dataUsage: [
        'To provide and improve our services',
        'To communicate with you about your account',
        'To ensure security and prevent fraud',
      ],
      userRights: [
        'Right to access your data',
        'Right to delete your account',
        'Right to export your data',
        'Right to rectify incorrect data',
      ],
      dataRetention: 'Active data is retained while your account is active. Deleted accounts are soft-deleted and permanently removed after 90 days.',
      contact: 'privacy@adaptiveai.example.com',
    });
  }
);

export default router;
