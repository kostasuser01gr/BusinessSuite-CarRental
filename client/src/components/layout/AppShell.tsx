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
  ChevronRight
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"

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

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Workspace", path: "/workspace", icon: Briefcase },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 lg:static lg:z-0 lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-64",
          !sidebarOpen && "lg:w-20"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
              A
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <span className="font-semibold tracking-tight text-lg">AdaptiveAI</span>
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
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50",
                    !sidebarOpen && "lg:justify-center"
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-500" : "text-zinc-500")} />
                  {(sidebarOpen || mobileMenuOpen) && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "lg:justify-center")}>
            <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user?.email || "User"}</span>
                <span className="text-xs text-zinc-500 truncate">Enterprise Plan</span>
              </div>
            )}
          </div>
          {(sidebarOpen || mobileMenuOpen) && (
            <Button
              variant="ghost"
              className="w-full mt-4 justify-start text-zinc-400 hover:text-zinc-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:px-6">
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
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
            
            <div className="hidden md:flex items-center relative w-64 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search resources..."
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-2", assistantOpen && "bg-zinc-800")}
              onClick={() => setAssistantOpen(!assistantOpen)}
            >
              <Bot className="h-4 w-4 text-blue-500" />
              <span className="hidden md:inline">Copilot</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Assistant Rail (Right Sidebar) */}
      {assistantOpen && (
        <aside className="w-80 shrink-0 border-l border-zinc-800 bg-zinc-950 hidden xl:flex flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 font-medium">
              <Bot className="h-5 w-5 text-blue-500" />
              AI Assistant
            </div>
            <Button variant="ghost" size="icon" onClick={() => setAssistantOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="rounded-lg bg-zinc-900 p-3 text-sm text-zinc-300">
              How can I help you optimize your operations today?
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Ask anything..."
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </aside>
      )}
    </div>
  )
}
