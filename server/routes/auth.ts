import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { signupSchema, loginSchema } from '../../shared/schemas.js'
import { createUser, findUserByEmail, findUserById } from '../store/index.js'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body)

    if (findUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      passwordHash,
    }

    createUser(newUser)

    req.session.userId = newUser.id
    const { passwordHash: _, ...userWithoutPassword } = newUser

    res.status(201).json(userWithoutPassword)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = findUserByEmail(email)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    req.session.userId = user.id
    const { passwordHash: _, ...userWithoutPassword } = user

    res.json(userWithoutPassword)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' })
    }
    res.clearCookie('adaptive_sid')
    res.json({ message: 'Logged out' })
  })
})

router.get('/me', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = findUserById(req.session.userId)
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { passwordHash: _, ...userWithoutPassword } = user
  res.json(userWithoutPassword)
})

export default router
