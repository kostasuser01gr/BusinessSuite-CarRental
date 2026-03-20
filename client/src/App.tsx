import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import WorkspacePage from './pages/WorkspacePage'
import { Button } from './components/ui/Button'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
            <Route path="/workspace" element={<AppShell><WorkspacePage /></AppShell>} />
            <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/not-found" element={
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-blue-600/20 font-bold text-blue-500 mb-6 text-2xl">
                404
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Page not found</h1>
              <p className="text-zinc-400 max-w-sm mb-8">The page you are looking for doesn't exist or has been moved.</p>
              <Button asChild>
                <Link to="/dashboard">Go back home</Link>
              </Button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
