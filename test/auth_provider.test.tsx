import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../client/src/providers/AuthProvider'
import * as api from '../client/src/lib/api'

// Mock apiFetch
vi.spyOn(api, 'apiFetch')

const TestComponent = () => {
  const { user, loading, logout } = useAuth()
  if (loading) return <div>Loading...</div>
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'no-user'}</div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthProvider - Verification Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides user data when session exists', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    // @ts-ignore
    api.apiFetch.mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })

  it('provides null user when session does not exist', async () => {
    // @ts-ignore
    api.apiFetch.mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      expect(screen.getByTestId('user-email')).toHaveTextContent('no-user')
    })
  })

  it('clears user on logout', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    // @ts-ignore
    api.apiFetch.mockResolvedValueOnce(mockUser) // Initial load
    // @ts-ignore
    api.apiFetch.mockResolvedValueOnce({}) // Logout call

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })

    const logoutBtn = screen.getByRole('button', { name: /logout/i })
    await act(async () => {
      logoutBtn.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('no-user')
    })
    expect(api.apiFetch).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }))
  })
})
