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
  Wrench
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { usePWA } from "../../hooks/usePWA"
import { motion, AnimatePresence } from "framer-motion"
import { CommandPalette } from "./CommandPalette"

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [assistantOpen, setAssistantOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { isInstallable, installApp } = usePWA()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Bookings", path: "/bookings", icon: Calendar },
    { name: "Fleet & Assets", path: "/assets", icon: Truck },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Workspace", path: "/workspace", icon: Briefcase },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Handle Cmd+B for sidebar toggle
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSidebarOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <CommandPalette />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: mobileMenuOpen ? 256 : sidebarOpen ? 256 : 80,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card lg:static lg:z-0 lg:translate-x-0 overflow-hidden",
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
              A
            </div>
            <AnimatePresence>
              {(sidebarOpen || mobileMenuOpen) && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-semibold tracking-tight text-lg whitespace-nowrap"
                >
                  AdaptiveAI
                </motion.span>
              )}
            </AnimatePresence>
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
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    !sidebarOpen && "lg:justify-center"
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110", 
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                  )} />
                  {(sidebarOpen || mobileMenuOpen) && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
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
              className="w-full mt-4 justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30">
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
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex h-9 w-full items-center rounded-md border border-input bg-background/50 pl-10 pr-4 text-sm text-muted-foreground group-hover:border-accent transition-colors">
                Search resources...
                <kbd className="ml-auto flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground font-sans">
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-2 transition-all", assistantOpen ? "bg-primary/10 border-primary/50 text-primary" : "hover:border-accent hover:bg-accent")}
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
      <AnimatePresence>
        {assistantOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="shrink-0 border-l border-border bg-card hidden xl:flex flex-col"
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border w-80">
              <div className="flex items-center gap-2 font-medium">
                <Bot className="h-5 w-5 text-primary" />
                AI Assistant
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAssistantOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 w-80">
              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                How can I help you optimize your operations today?
              </div>
            </div>
            <div className="p-4 border-t border-border w-80">
              <input
                type="text"
                placeholder="Ask anything..."
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
