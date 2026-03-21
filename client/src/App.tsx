import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { PreferencesProvider } from './providers/PreferencesProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import WorkspacePage from './pages/WorkspacePage'
import CustomersPage from './pages/CustomersPage'
import BookingsPage from './pages/BookingsPage'
import AssetsPage from './pages/AssetsPage'
import MaintenancePage from './pages/MaintenancePage'
import { Button } from './components/ui/Button'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AppShell><MotionPage><DashboardPage /></MotionPage></AppShell>} />
          <Route path="/customers" element={<AppShell><MotionPage><CustomersPage /></MotionPage></AppShell>} />
          <Route path="/bookings" element={<AppShell><MotionPage><BookingsPage /></MotionPage></AppShell>} />
          <Route path="/assets" element={<AppShell><MotionPage><AssetsPage /></MotionPage></AppShell>} />
          <Route path="/maintenance" element={<AppShell><MotionPage><MaintenancePage /></MotionPage></AppShell>} />
          <Route path="/workspace" element={<AppShell><MotionPage><WorkspacePage /></MotionPage></AppShell>} />
          <Route path="/settings" element={<AppShell><MotionPage><SettingsPage /></MotionPage></AppShell>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/not-found" element={
          <MotionPage>
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
          </MotionPage>
        } />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function MotionPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </PreferencesProvider>
  )
}
