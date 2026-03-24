import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { config } from './config/index.js'
import authRoutes from './routes/auth.js'
import protectedRoutes from './routes/protected.js'

export const app = express()

app.use(cors({
  origin: [config.clientUrl],
  credentials: true
}))

app.use(express.json())

app.use(session({
  name: 'adaptive_sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}))

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'adaptiveai-business-suite-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoutes)

if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`)
  })
}
