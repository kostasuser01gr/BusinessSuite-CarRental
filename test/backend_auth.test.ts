import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../server/index.js'
import { usersStore } from '../server/store/index.js'

describe('Backend Auth API', () => {
  beforeEach(() => {
    // Clear in-memory store before each test
    usersStore.length = 0
  })

  describe('GET /health', () => {
    it('should return 200 ok', async () => {
      const res = await request(app).get('/health')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ ok: true, service: 'adaptiveai-business-suite-api' })
    })
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(201)
      expect(res.body.user.email).toBe('test@example.com')
      expect(res.body.token).toBeDefined()
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

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
      
      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
    })

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    let token: string

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      token = res.body.token
    })

    it('should return user info with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(200)
      expect(res.body.email).toBe('test@example.com')
    })

    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.status).toBe(401)
    })
  })
})
