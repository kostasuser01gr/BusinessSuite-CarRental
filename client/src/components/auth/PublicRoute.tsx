import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'

export default function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
