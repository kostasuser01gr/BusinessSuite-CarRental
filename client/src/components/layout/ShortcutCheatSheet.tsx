import { Dialog } from '../ui/Dialog'
import { Command, Keyboard } from 'lucide-react'

interface ShortcutCheatSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ShortcutCheatSheet({ isOpen, onClose }: ShortcutCheatSheetProps) {
  const shortcuts = [
    { 
      group: "General",
      items: [
        { key: "Cmd + K", description: "Open Command Palette" },
        { key: "Cmd + B", description: "Toggle Sidebar" },
        { key: "?", description: "Show this help" },
        { key: "Esc", description: "Close modals/menus" },
      ]
    },
    { 
      group: "Navigation",
      items: [
        { key: "G then D", description: "Go to Dashboard" },
        { key: "G then C", description: "Go to Customers" },
        { key: "G then B", description: "Go to Bookings" },
        { key: "G then S", description: "Go to Settings" },
      ]
    },
    { 
      group: "Actions",
      items: [
        { key: "N", description: "Create new task (Dashboard)" },
        { key: "S", description: "Focus search in modules" },
      ]
    }
  ]

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Keyboard Shortcuts" 
      description="Boost your productivity with these powerful shortcuts."
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
        {shortcuts.map((group) => (
          <div key={group.group} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-2">
              <Command className="h-3 w-3" />
              {group.group}
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between group">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.description}</span>
                  <kbd className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-[10px] font-medium text-foreground shadow-sm">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg bg-primary/5 p-4 flex items-start gap-3 border border-primary/10">
        <Keyboard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-primary">Pro tip:</span> You can use shortcuts combined with the Command Palette to navigate even faster. Try typing part of a command name and pressing Enter.
        </div>
      </div>
    </Dialog>
  )
}
