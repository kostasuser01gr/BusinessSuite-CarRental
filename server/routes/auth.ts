import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { createUser, findUserByEmail, findUserById } from '../store/index.js'

const router = Router()
const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev'

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

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

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' })
    const { passwordHash: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    const { passwordHash: _, ...userWithoutPassword } = user

    res.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = findUserById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { passwordHash: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router
