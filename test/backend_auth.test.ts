import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../server/index.js'
import { clearStore } from '../server/store/index.js'

describe('Backend Auth API (Session-based)', () => {
  const agent = request.agent(app)

  beforeEach(() => {
    clearStore()
  })

  describe('GET /health', () => {
    it('should return 200 ok', async () => {
      const res = await request(app).get('/health')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ ok: true, service: 'adaptiveai-business-suite-api' })
    })
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user and set session cookie', async () => {
      const res = await agent
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(201)
      expect(res.body.email).toBe('test@example.com')
      expect(res.header['set-cookie']).toBeDefined()
    })

    it('should fail with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'T',
          email: 'not-an-email',
          password: '123'
        })
      
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
    })

    it('should login with correct credentials and set session', async () => {
      const res = await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(200)
      expect(res.header['set-cookie']).toBeDefined()
    })

    it('should fail with wrong password', async () => {
      const res = await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      
      expect(res.status).toBe(401)
    })
  })

  describe('Auth Flow & Protected Routes', () => {
    beforeEach(async () => {
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
    })

    it('should return user info for authenticated session', async () => {
      const res = await agent.get('/api/auth/me')
      expect(res.status).toBe(200)
      expect(res.body.email).toBe('test@example.com')
    })

    it('should allow access to protected ping for authenticated session', async () => {
      const res = await agent.get('/api/protected/ping')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('pong')
    })

    it('should block access to protected ping after logout', async () => {
      await agent.post('/api/auth/logout')
      const res = await agent.get('/api/protected/ping')
      expect(res.status).toBe(401)
    })

    it('should block unauthorized access to protected routes', async () => {
      const unauthorizedAgent = request.agent(app)
      const res = await unauthorizedAgent.get('/api/protected/ping')
      expect(res.status).toBe(401)
    })
  })
})
