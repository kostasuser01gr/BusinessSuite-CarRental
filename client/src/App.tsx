import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell><DashboardPage /></AppShell>} path="/dashboard" />
            <Route element={<AppShell><SettingsPage /></AppShell>} path="/settings" />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
              <h1 className="text-4xl font-bold text-blue-500">404</h1>
              <p className="mt-2 text-zinc-400">Page not found</p>
              <a href="/dashboard" className="mt-6 text-blue-500 hover:underline">Go back home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
