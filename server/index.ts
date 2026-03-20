import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'adaptiveai-business-suite-api' })
})

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
