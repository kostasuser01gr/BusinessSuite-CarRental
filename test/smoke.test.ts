import { describe, it, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../server/index'

const request = supertest(app)

describe('bootstrap smoke test', () => {
  it('confirms test runner is working', () => {
    expect(true).toBe(true)
  })

  it('verifies backend /health endpoint', async () => {
    const res = await request.get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true, service: 'adaptiveai-business-suite-api' })
  })
})
