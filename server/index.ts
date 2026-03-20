import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

export const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({
  origin: [process.env.VITE_CLIENT_URL || 'http://localhost:3100'],
  credentials: true
}))

app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'adaptiveai-business-suite-api' })
})

app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
}
