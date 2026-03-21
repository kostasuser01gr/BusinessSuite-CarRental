import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { PreferencesProvider, usePreferences } from './providers/PreferencesProvider'
import { OperationsProvider } from './providers/OperationsProvider'
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
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function AnimatedRoutes() {
  const location = useLocation()
  const { landingPage } = usePreferences()
  
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

        <Route path="/" element={<Navigate to={landingPage} replace />} />
        <Route path="/not-found" element={
          <MotionPage>
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-primary/20 font-bold text-primary mb-6 text-2xl">
                404
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Page not found</h1>
              <p className="text-muted-foreground max-w-sm mb-8">The page you are looking for doesn't exist or has been moved.</p>
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
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
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
        <OperationsProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </OperationsProvider>
      </AuthProvider>
    </PreferencesProvider>
  )
}
