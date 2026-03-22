import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './providers/AuthProvider'
import { PreferencesProvider, usePreferences } from './providers/PreferencesProvider'
import { OperationsProvider } from './providers/OperationsProvider'
import { ToastProvider } from './providers/ToastProvider'
import { OnboardingProvider } from './providers/OnboardingProvider'
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
import KnowledgePage from './pages/KnowledgePage'
import AutomationPage from './pages/AutomationPage'
import { Button } from './components/ui/Button'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { animatePageEnter } from './animations'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnboardingTour } from './components/layout/OnboardingTour'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Bot, Loader2 } from 'lucide-react'

/**
 * AnimatedRoutes coordinates page entry transitions with Anime.js.
 */
function AnimatedRoutes() {
  const location = useLocation()
  const { landingPage } = usePreferences()
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<MotionPage><LoginPage /></MotionPage>} />
        <Route path="/signup" element={<MotionPage><SignupPage /></MotionPage>} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AppShell><MotionPage><DashboardPage /></MotionPage></AppShell>} />
        <Route path="/customers" element={<AppShell><MotionPage><CustomersPage /></MotionPage></AppShell>} />
        <Route path="/bookings" element={<AppShell><MotionPage><BookingsPage /></MotionPage></AppShell>} />
        <Route path="/assets" element={<AppShell><MotionPage><AssetsPage /></MotionPage></AppShell>} />
        <Route path="/maintenance" element={<AppShell><MotionPage><MaintenancePage /></MotionPage></AppShell>} />
        <Route path="/knowledge" element={<AppShell><MotionPage><KnowledgePage /></MotionPage></AppShell>} />
        <Route path="/automation" element={<AppShell><MotionPage><AutomationPage /></MotionPage></AppShell>} />
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
  )
}

/**
 * MotionPage provides a premium route transition for every page.
 */
function MotionPage({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  
  useEffect(() => {
    if (containerRef.current) {
      animatePageEnter(containerRef.current)
    }
  }, [location.pathname])
  
  return (
    <div ref={containerRef} className="h-full opacity-0">
      {children}
    </div>
  )
}

function GlobalLoader() {
  const { loading } = useAuth()
  
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-background flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 animate-pulse">
          <Bot className="h-12 w-12 text-primary-foreground" />
        </div>
        <div className="absolute -inset-4 border-2 border-primary/20 rounded-full border-t-primary animate-spin" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-black uppercase tracking-[0.3em] text-foreground">AdaptiveAI</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
          <Loader2 className="h-3 w-3 animate-spin" />
          Synchronizing Neural Interface...
        </div>
      </div>
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <OnboardingProvider>
            <PreferencesProvider>
              <AuthProvider>
                <GlobalLoader />
                <OperationsProvider>
                  <BrowserRouter>
                    <AnimatedRoutes />
                    <OnboardingTour />
                  </BrowserRouter>
                </OperationsProvider>
              </AuthProvider>
            </PreferencesProvider>
          </OnboardingProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
