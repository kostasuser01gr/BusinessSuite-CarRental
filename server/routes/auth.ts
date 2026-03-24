import { Router, Request, Response } from 'express';
import { signupSchema, loginSchema } from '../../shared/schemas.js';
import { AuthService } from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { auditLogger } from '../middleware/logging.js';

const router = Router();

router.post('/signup', authLimiter, auditLogger('user.signup'), asyncHandler(async (req: Request, res: Response) => {
  const validated = signupSchema.parse(req.body);
  const user = await AuthService.signup(validated);

  req.session.userId = user.id;
  res.status(201).json(user);
}));

router.post('/login', authLimiter, auditLogger('user.login'), asyncHandler(async (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const user = await AuthService.login(validated);

  req.session.userId = user.id;
  res.status(200).json(user);
}));

router.post('/logout', auditLogger('user.logout'), (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('adaptive_sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', requireAuth, async (req, res) => {
  // requireAuth already populated req.user
  res.json(req.user)
})

// WebAuthn Scaffolding
router.post('/webauthn/register-options', requireAuth, async (req, res) => {
  // Architectural placeholder: return options for navigator.credentials.create()
  res.json({
    challenge: 'mock-challenge',
    rp: { name: 'AdaptiveAI' },
    user: { id: req.user?.id, name: req.user?.email, displayName: req.user?.name },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }]
  })
})

router.post('/webauthn/register-verify', requireAuth, async (req, res) => {
  // Architectural placeholder: verify the credential
  res.json({ success: true, message: 'Credential registered (mock verification)' })
})

router.post('/webauthn/login-options', async (req, res) => {
  // Architectural placeholder: return options for navigator.credentials.get()
  res.json({ challenge: 'mock-challenge', timeout: 60000 })
})

router.post('/webauthn/login-verify', async (req, res) => {
  // Architectural placeholder: verify the login
  res.json({ success: true, user: { id: '1', name: 'Mock User', email: 'mock@example.com' } })
})

export default router
