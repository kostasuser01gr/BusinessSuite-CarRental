import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../client/src/providers/AuthProvider'
import LoginPage from '../client/src/pages/LoginPage'
import SignupPage from '../client/src/pages/SignupPage'

describe('Frontend Auth Pages', () => {
  it('renders login page correctly', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    )
    
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('renders signup page correctly', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <SignupPage />
        </BrowserRouter>
      </AuthProvider>
    )
    
    expect(screen.getByRole('heading', { name: /Create account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
  })
})
