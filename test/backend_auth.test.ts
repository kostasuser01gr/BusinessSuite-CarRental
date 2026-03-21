import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../server/index.js'
import { clearStore } from '../server/store/index.js'

describe('Backend Auth API - Hardening Suite', () => {
  const agent = request.agent(app)

  beforeEach(() => {
    clearStore()
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user and set session cookie', async () => {
      const res = await agent
        .post('/api/auth/signup')
        .send({
          name: 'Harden User',
          email: 'harden@example.com',
          password: 'securePassword123'
        })
      
      expect(res.status).toBe(201)
      expect(res.body.email).toBe('harden@example.com')
      expect(res.body.passwordHash).toBeUndefined()
      expect(res.header['set-cookie']).toBeDefined()
    })

    it('should fail if user already exists', async () => {
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'First User',
          email: 'dup@example.com',
          password: 'password123'
        })

      const res = await agent
        .post('/api/auth/signup')
        .send({
          name: 'Second User',
          email: 'dup@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(400)
      expect(res.body.error).toContain('already exists')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
    })

    it('should login with correct credentials', async () => {
      const loginAgent = request.agent(app)
      const res = await loginAgent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(200)
      expect(res.body.email).toBe('test@example.com')
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
      expect(res.body.error).toBe('Invalid credentials')
    })
  })

  describe('Auth Protection', () => {
    it('should allow access to /me only when logged in', async () => {
      // 1. Unauthenticated
      const res1 = await request(app).get('/api/auth/me')
      expect(res1.status).toBe(401)

      // 2. Authenticated
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'Me User',
          email: 'me@example.com',
          password: 'password123'
        })
      
      const res2 = await agent.get('/api/auth/me')
      expect(res2.status).toBe(200)
      expect(res2.body.email).toBe('me@example.com')
    })

    it('should allow access to protected ping when logged in', async () => {
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'Ping User',
          email: 'ping@example.com',
          password: 'password123'
        })
      
      const res = await agent.get('/api/protected/ping')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('pong')
      expect(res.body.user.email).toBe('ping@example.com')
    })

    it('should block access after logout', async () => {
      await agent
        .post('/api/auth/signup')
        .send({
          name: 'Logout User',
          email: 'logout@example.com',
          password: 'password123'
        })
      
      await agent.post('/api/auth/logout')
      
      const res = await agent.get('/api/protected/ping')
      expect(res.status).toBe(401)
    })
  })
})
