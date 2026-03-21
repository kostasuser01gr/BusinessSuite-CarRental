import { Router } from 'express'
import { signupSchema, loginSchema } from '../../shared/schemas.js'
import { AuthService } from '../services/auth.service.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const validated = signupSchema.parse(req.body)
    const user = await AuthService.signup(validated)
    
    req.session.userId = user.id
    res.status(201).json(user)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: error.errors })
    }
    const status = error.status || 500
    const message = error.message || 'Server error during signup'
    res.status(status).json({ error: message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body)
    const user = await AuthService.login(validated)

    req.session.userId = user.id
    res.status(200).json(user)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: error.errors })
    }
    const status = error.status || 500
    const message = error.message || 'Server error during login'
    res.status(status).json({ error: message })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' })
    }
    res.clearCookie('adaptive_sid')
    res.json({ message: 'Logged out successfully' })
  })
})

router.get('/me', requireAuth, async (req, res) => {
  // requireAuth already populated req.user
  res.json(req.user)
})

export default router
