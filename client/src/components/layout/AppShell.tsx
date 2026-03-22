import * as React from "react"
import { cn } from "../../utils/cn"
import { Button } from "../ui/Button"
import {
  Menu,
  X,
  LayoutDashboard,
  Settings,
  Briefcase,
  Bot,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  Calendar,
  Truck,
  Wrench,
  HelpCircle,
  WifiOff,
  RefreshCw,
  Book,
  Zap
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { usePWA } from "../../hooks/usePWA"
import { CommandPalette } from "./CommandPalette"
import { useTasks } from "../../hooks/useTasks"
import { useOnboarding } from "../../providers/OnboardingProvider"
import { ShortcutCheatSheet } from "./ShortcutCheatSheet"
import { usePreferences } from "../../providers/PreferencesProvider"
import { useNetworkStatus } from "../../hooks/useNetworkStatus"
import { SystemPulse } from "./SystemPulse"
import { AssistantModule } from "../dashboard/AssistantModule"
import {
  animateBannerIn,
  animateHoverLift,
  animateSidebarLabel,
  animateStaggeredReveal,
  motionTokens,
} from "../../animations"
import { animate } from "animejs"

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [assistantOpen, setAssistantOpen] = React.useState(false)
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false)
  const logoRef = React.useRef<HTMLDivElement>(null)
  const mobileOverlayRef = React.useRef<HTMLDivElement>(null)
  const offlineBannerRef = React.useRef<HTMLDivElement>(null)
  const assistantRailRef = React.useRef<HTMLElement>(null)
  const navRef = React.useRef<HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { isInstallable, installApp } = usePWA()
  const { tasks } = useTasks()
  const { startTour } = useOnboarding()
  const { shortcutsEnabled } = usePreferences()
  const isOnline = useNetworkStatus()

  const pendingTasksCount = tasks.filter(t => !t.completed).length

  React.useEffect(() => {
    if (logoRef.current) {
      animate(logoRef.current, {
        scale: [1, 1.1, 1],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true,
      })
    }
  }, [])

  React.useEffect(() => {
    if (mobileMenuOpen && mobileOverlayRef.current) {
      animateBannerIn(mobileOverlayRef.current)
    }
  }, [mobileMenuOpen])

  React.useEffect(() => {
    if (!isOnline && offlineBannerRef.current) {
      animateBannerIn(offlineBannerRef.current)
    }
  }, [isOnline])

  React.useEffect(() => {
    if (assistantOpen && assistantRailRef.current) {
      animate(assistantRailRef.current, {
        opacity: [0, 1],
        translateX: [motionTokens.distance.md, 0],
        duration: motionTokens.duration.normal,
        ease: motionTokens.easing.standard,
      })
    }
  }, [assistantOpen])

  React.useEffect(() => {
    if (navRef.current) {
      animateStaggeredReveal(navRef.current.querySelectorAll('[data-nav-item]'), 32)
    }
  }, [sidebarOpen, mobileMenuOpen])

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Bookings", path: "/bookings", icon: Calendar },
    { name: "Fleet & Assets", path: "/assets", icon: Truck },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Automation", path: "/automation", icon: Zap },
    { name: "Knowledge", path: "/knowledge", icon: Book },
    { name: "Workspace", path: "/workspace", icon: Briefcase },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Handle Cmd+B for sidebar toggle and '?' for shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSidebarOpen(open => !open)
      }
      
      if (!shortcutsEnabled) return;

      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setShortcutsOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [shortcutsEnabled])

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans relative">
      <SystemPulse />
      <CommandPalette />
      <ShortcutCheatSheet isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileOverlayRef}
          className="fixed inset-0 z-40 bg-background/80 opacity-0 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-[width,transform] duration-300 ease-out lg:static lg:z-0 lg:translate-x-0 overflow-hidden shadow-2xl shadow-primary/5",
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-64"
        )}
        style={{ width: mobileMenuOpen ? 256 : sidebarOpen ? 256 : 80 }}
        data-tour="sidebar"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div ref={logoRef} className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
              A
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <span
                ref={(node) => {
                  if (node) animateSidebarLabel(node)
                }}
                className="font-semibold tracking-tight text-lg whitespace-nowrap"
              >
                AdaptiveAI
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav ref={navRef} className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group relative",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    !sidebarOpen && "lg:justify-center"
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                  data-nav-item
                  onMouseEnter={(event) => animateHoverLift(event.currentTarget, true)}
                  onMouseLeave={(event) => animateHoverLift(event.currentTarget, false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110", 
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                  )} />
                  {(sidebarOpen || mobileMenuOpen) && (
                    <>
                      <span className="whitespace-nowrap flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && item.badge && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          {(sidebarOpen || mobileMenuOpen) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={startTour}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Quick Tour
              </Button>
              {shortcutsEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setShortcutsOpen(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Shortcuts
                </Button>
              )}
            </>
          )}
          <div className={cn("flex items-center gap-3", !sidebarOpen && "lg:justify-center")}>
            <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate text-foreground">{user?.name || user?.email?.split('@')[0] || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">Enterprise Plan</span>
              </div>
            )}
          </div>
          {(sidebarOpen || mobileMenuOpen) && (
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-w-0 relative z-10">
        {/* Offline Banner */}
        {!isOnline && (
          <div
            ref={offlineBannerRef}
            className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 overflow-hidden shrink-0 shadow-lg opacity-0"
          >
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline Mode: Your changes are being queued and will sync when reconnected.</span>
            <RefreshCw className="h-3 w-3 animate-spin ml-2" />
          </div>
        )}

        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/60 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex hover:bg-accent text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar (Cmd+B)"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
            
            <div 
              className="hidden md:flex items-center relative w-64 max-w-sm cursor-pointer group"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              data-tour="search"
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex h-9 w-full items-center rounded-md border border-input bg-background/40 pl-10 pr-4 text-sm text-muted-foreground group-hover:border-accent transition-colors">
                Search resources...
                <kbd className="ml-auto flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground font-sans border border-border">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={installApp}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                title="Install App"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-2 transition-all shadow-sm", assistantOpen ? "bg-primary/10 border-primary/50 text-primary" : "hover:border-accent hover:bg-accent")}
              onClick={() => setAssistantOpen(!assistantOpen)}
            >
              <Bot className={cn("h-4 w-4", assistantOpen ? "text-primary" : "text-muted-foreground")} />
              <span className="hidden md:inline">Copilot</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 min-h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Assistant Rail (Right Sidebar) */}
      {assistantOpen && (
        <aside
          ref={assistantRailRef}
          className="hidden xl:flex w-80 shrink-0 border-l border-border bg-card/80 backdrop-blur-xl flex-col shadow-2xl opacity-0"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border w-80">
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-primary">
              <Bot className="h-5 w-5" />
              AI Assistant
            </div>
            <Button variant="ghost" size="icon" onClick={() => setAssistantOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto w-80">
            <AssistantModule />
          </div>
        </aside>
      )}
    </div>
  )
}
