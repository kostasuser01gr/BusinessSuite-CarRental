import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../../../shared/types'
import { apiFetch } from '../lib/api'

export type { User }

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await apiFetch('/api/auth/me')
        setUser(userData)
      } catch (error) {
        // Not logged in or session expired
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
