import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate } from 'animejs'
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
  ArrowRight,
  Keyboard,
  Moon,
  Sun,
  Zap,
  Book
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useSearch } from '../../hooks/useSearch'
import { EmptyState } from '../ui/EmptyState'
import { usePreferences } from '../../providers/PreferencesProvider'
import { globalEventBus, SYSTEM_EVENTS } from '../../lib/eventBus'
import { useToast } from '../../providers/ToastProvider'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { data: searchResults, isLoading: isSearching } = useSearch(search)
  const { theme, setTheme } = usePreferences()
  const { addToast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  useEffect(() => {
    if (open) {
      if (overlayRef.current && contentRef.current) {
        animate(overlayRef.current, {
          opacity: [0, 1],
          duration: 300,
          easing: 'easeOutQuad',
        });
        animate(contentRef.current, {
          opacity: [0, 1],
          scale: [0.95, 1],
          translateY: [-20, 0],
          duration: 300,
          easing: 'easeOutCubic',
        });
      }
    }
  }, [open])

  const executeAction = (action: any) => {
    if (contentRef.current && overlayRef.current) {
      animate(contentRef.current, {
        opacity: [1, 0],
        scale: [1, 0.95],
        translateY: [0, -20],
        duration: 200,
        easing: 'easeInCubic',
        complete: () => {
          setOpen(false)
          setSearch('')
          handleExecution(action)
        }
      });
      animate(overlayRef.current, {
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
      });
    } else {
      setOpen(false)
      setSearch('')
      handleExecution(action)
    }
  }

  const handleExecution = (action: any) => {
    if (action.path) {
      navigate(action.path)
    } else if (action.type === 'action') {
      if (action.id === 'theme-toggle') {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        addToast(`Switched to ${newTheme} mode`, 'success')
      } else if (action.id === 'create-task') {
        navigate('/dashboard?action=create-task')
        globalEventBus.emit(SYSTEM_EVENTS.QUICK_ACTION_TRIGGERED, { action: 'create-task' })
      } else if (action.id === 'add-note') {
        navigate('/dashboard?action=add-note')
        globalEventBus.emit(SYSTEM_EVENTS.QUICK_ACTION_TRIGGERED, { action: 'add-note' })
      }
    }
  }

  const defaultActions = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', type: 'nav' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers', type: 'nav' },
    { id: 'bookings', name: 'Bookings', icon: Calendar, path: '/bookings', type: 'nav' },
    { id: 'assets', name: 'Fleet & Assets', icon: Truck, path: '/assets', type: 'nav' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, path: '/maintenance', type: 'nav' },
    { id: 'automation', name: 'Automation', icon: Zap, path: '/automation', type: 'nav' },
    { id: 'knowledge', name: 'Knowledge', icon: Book, path: '/knowledge', type: 'nav' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings', type: 'nav' },
    { id: 'create-task', name: 'Create New Task', icon: PlusCircle, type: 'action' },
    { id: 'add-note', name: 'Add Quick Note', icon: FileText, type: 'action' },
    { id: 'theme-toggle', name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, type: 'action' },
  ]

  const displayResults = search.length >= 2 
    ? (searchResults || []) 
    : defaultActions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

  const getIcon = (action: any) => {
    if (action.icon) return action.icon;
    switch (action.type) {
      case 'task': return PlusCircle;
      case 'note': return FileText;
      case 'asset': return Truck;
      case 'booking': return Calendar;
      case 'customer': return Users;
      default: return ArrowRight;
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm opacity-0"
      />
      <div
        ref={contentRef}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl mx-4 opacity-0 scale-95 -translate-y-5"
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className={cn("h-5 w-5 text-muted-foreground mr-3", isSearching && "animate-pulse")} />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && displayResults.length > 0) {
                executeAction(displayResults[0])
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
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar min-h-[200px] flex flex-col">
          {displayResults.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState 
                title="No results found"
                description={`We couldn't find anything matching "${search}"`}
                illustration="no-search"
                className="py-4"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>{search.length >= 2 ? 'Search Results' : 'Suggestions'}</span>
                {search.length >= 2 && <span className="text-primary/50 normal-case font-normal">{displayResults.length} found</span>}
              </div>
              {displayResults.map((action: any, index) => {
                const Icon = getIcon(action);
                return (
                  <button
                    key={action.id || `${action.type}-${action.name}`}
                    onClick={() => executeAction(action)}
                    className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:translate-x-1"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-medium truncate">{action.name}</span>
                      <span className="text-[10px] text-muted-foreground opacity-70 capitalize">
                        {action.description || action.type}
                      </span>
                    </div>
                    {index === 0 && search && (
                      <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        Enter
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-t border-border bg-muted/30 p-2 text-[10px] text-muted-foreground flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <span>Quick search for anything</span>
            <button 
              onClick={() => {
                setOpen(false);
                document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
              }}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Keyboard className="h-3 w-3" />
              <span>Shortcuts</span>
            </button>
          </div>
          <div className="flex gap-2">
            <span className="bg-muted px-1 rounded border border-border">Esc</span>
            <span className="bg-muted px-1 rounded border border-border">Enter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
