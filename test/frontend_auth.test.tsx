import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../client/src/providers/AuthProvider'
import { ToastProvider } from '../client/src/providers/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '../client/src/pages/LoginPage'
import SignupPage from '../client/src/pages/SignupPage'
import * as api from '../client/src/lib/api'

// Mock apiFetch
vi.spyOn(api, 'apiFetch')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('Frontend Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock for /api/auth/me during AuthProvider initialization
    // @ts-ignore
    api.apiFetch.mockImplementation((endpoint) => {
      if (endpoint === '/api/auth/me') {
        return Promise.reject(new Error('Not authenticated'))
      }
      return Promise.resolve({})
    })
  })

  it('renders login page correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <LoginPage />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalledWith('/api/auth/me')
    })
    
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('handles login form submission', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    // @ts-ignore
    api.apiFetch.mockResolvedValueOnce(mockUser)

    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <LoginPage />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      }))
    })
  })

  it('renders signup page correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <SignupPage />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalledWith('/api/auth/me')
    })
    
    expect(screen.getByRole('heading', { name: /Create account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
  })

  it('handles signup form submission', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    // @ts-ignore
    api.apiFetch.mockResolvedValueOnce(mockUser)

    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <SignupPage />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }))

    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalledWith('/api/auth/signup', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' })
      }))
    })
  })
})
