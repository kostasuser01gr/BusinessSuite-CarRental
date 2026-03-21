import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Calendar, 
  Truck, 
  Wrench, 
  X, 
  PlusCircle,
  FileText,
  UserPlus
} from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard', type: 'nav' },
    { id: 'customers', name: 'Go to Customers', icon: Users, path: '/customers', type: 'nav' },
    { id: 'bookings', name: 'Go to Bookings', icon: Calendar, path: '/bookings', type: 'nav' },
    { id: 'assets', name: 'Go to Fleet & Assets', icon: Truck, path: '/assets', type: 'nav' },
    { id: 'maintenance', name: 'Go to Maintenance', icon: Wrench, path: '/maintenance', type: 'nav' },
    { id: 'settings', name: 'Go to Settings', icon: Settings, path: '/settings', type: 'nav' },
    { id: 'create-task', name: 'Create New Task', icon: PlusCircle, path: '/dashboard?action=create-task', type: 'action' },
    { id: 'add-note', name: 'Add Quick Note', icon: FileText, path: '/dashboard?action=add-note', type: 'action' },
    { id: 'add-customer', name: 'Add New Customer', icon: UserPlus, path: '/customers?action=add', type: 'action' },
  ]

  const filteredActions = actions.filter((action) =>
    action.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (path: string) => {
    navigate(path)
    setOpen(false)
    setSearch('')
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl mx-4"
          >
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false)
                  if (e.key === 'Enter' && filteredActions.length > 0) {
                    handleSelect(filteredActions[0].path)
                  }
                }}
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {filteredActions.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {['nav', 'action'].map((type) => {
                    const typeActions = filteredActions.filter(a => a.type === type)
                    if (typeActions.length === 0) return null
                    return (
                      <div key={type} className="mb-2 last:mb-0">
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {type === 'nav' ? 'Navigation' : 'Quick Actions'}
                        </div>
                        {typeActions.map((action, index) => (
                          <button
                            key={action.id}
                            onClick={() => handleSelect(action.path)}
                            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            {action.name}
                            {index === 0 && search && (
                              <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                Enter
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="border-t border-border bg-muted/30 p-2 text-[10px] text-muted-foreground flex justify-between items-center px-4">
              <span>Use <kbd className="font-sans bg-muted px-1 rounded mx-1 border border-border">↑</kbd> <kbd className="font-sans bg-muted px-1 rounded mx-1 border border-border">↓</kbd> to navigate</span>
              <span><kbd className="font-sans bg-muted px-1 rounded border border-border">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
