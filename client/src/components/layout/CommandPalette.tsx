import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, Settings, Users, Calendar, Truck, Wrench, X } from 'lucide-react'

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
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'bookings', name: 'Bookings', icon: Calendar, path: '/bookings' },
    { id: 'assets', name: 'Fleet & Assets', icon: Truck, path: '/assets' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
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
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-blue-900/10 mx-4"
          >
            <div className="flex items-center border-b border-zinc-800 px-4 py-3">
              <Search className="h-5 w-5 text-zinc-500 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
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
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  No results found.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
                    Navigation
                  </div>
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action.path)}
                      className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                    >
                      <action.icon className="h-4 w-4 text-zinc-500 group-hover:text-blue-500" />
                      {action.name}
                      {index === 0 && search && (
                        <span className="ml-auto text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                          Enter
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-zinc-800 bg-zinc-900/30 p-2 text-xs text-zinc-500 flex justify-between items-center px-4">
              <span>Use <kbd className="font-sans bg-zinc-800 px-1 rounded mx-1 text-zinc-300">↑</kbd> <kbd className="font-sans bg-zinc-800 px-1 rounded mx-1 text-zinc-300">↓</kbd> to navigate</span>
              <span><kbd className="font-sans bg-zinc-800 px-1 rounded text-zinc-300">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
