import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../client/src/providers/AuthProvider'
import ProtectedRoute from '../client/src/components/auth/ProtectedRoute'
import * as api from '../client/src/lib/api'

// Mock apiFetch
vi.spyOn(api, 'apiFetch')

describe('Route Protection - Verification Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users to login', async () => {
    // Mock /api/auth/me to fail (not logged in)
    // @ts-ignore
    api.apiFetch.mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    // Initially might show nothing or loader
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument()
  })

  it('allows authenticated users to access protected routes', async () => {
    // Mock /api/auth/me to succeed
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    // @ts-ignore
    api.apiFetch.mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })
})
