import { useState, useEffect } from "react"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Download, Edit3, Check, EyeOff, GripVertical } from "lucide-react"
import { KPIModule } from "../components/dashboard/KPIModule"
import { TasksModule } from "../components/dashboard/TasksModule"
import { NotesModule } from "../components/dashboard/NotesModule"
import { AssistantModule } from "../components/dashboard/AssistantModule"
import { ActivityTimelineModule } from "../components/dashboard/ActivityTimelineModule"
import { usePreferences, DashboardWidget } from "../providers/PreferencesProvider"
import { Reorder, AnimatePresence, motion } from "framer-motion"
import { cn } from "../utils/cn"

const WIDGET_COMPONENTS: Record<string, React.ReactNode> = {
  'kpi': <KPIModule />,
  'tasks': <TasksModule />,
  'notes': <NotesModule />,
  'assistant': <div className="h-[400px]"><AssistantModule /></div>,
  'timeline': <ActivityTimelineModule />,
}

export default function DashboardPage() {
  const { widgets, setWidgets } = usePreferences()
  const [isEditing, setIsEditing] = useState(false)

  // Sync local state for reordering to avoid lag
  const [localWidgets, setLocalWidgets] = useState(widgets)

  useEffect(() => {
    if (!isEditing) {
      setLocalWidgets(widgets)
    }
  }, [widgets, isEditing])

  const handleReorder = (newOrder: DashboardWidget[]) => {
    setLocalWidgets(newOrder)
  }

  const saveLayout = () => {
    // Update order values based on array index
    const updated = localWidgets.map((w, i) => ({ ...w, order: i }))
    setWidgets(updated)
    setIsEditing(false)
  }

  const toggleVisibility = (id: string) => {
    setLocalWidgets(localWidgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w))
  }

  return (
    <div className="flex flex-col gap-6 max-w-full animate-in fade-in duration-500">
      <SectionHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your operations today."
        action={
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button onClick={saveLayout} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Check className="h-4 w-4" />
                <span>Save Layout</span>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Dashboard</span>
              </Button>
            )}
            {!isEditing && (
              <Button variant="outline" className="gap-2 hidden md:flex">
                <Download className="h-4 w-4" />
                <span>Report</span>
              </Button>
            )}
          </div>
        }
      />

      {isEditing ? (
        <div className="bg-muted/30 border border-border rounded-xl p-6 mb-4 backdrop-blur-sm shadow-inner">
          <p className="text-sm text-muted-foreground mb-6">Drag to reorder modules. Click the eye icon to toggle visibility on your main view.</p>
          <Reorder.Group axis="y" values={localWidgets} onReorder={handleReorder} className="flex flex-col gap-3">
            {localWidgets.map((widget) => (
              <Reorder.Item 
                key={widget.id} 
                value={widget}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all cursor-grab active:cursor-grabbing",
                  widget.visible ? "bg-card border-border hover:border-primary/50" : "bg-muted/50 border-border/50 opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-1.5 bg-muted rounded text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm capitalize">{widget.id} Module</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleVisibility(widget.id)}
                  className={cn("hover:bg-muted", widget.visible ? "text-primary" : "text-muted-foreground")}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {localWidgets.filter(w => w.visible).sort((a, b) => a.order - b.order).map((widget) => {
              // We inject standard widths depending on the widget type so it looks good in a flow layout.
              const isFullWidth = widget.id === 'kpi' || widget.id === 'assistant';
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  key={widget.id}
                  className={cn("w-full", !isFullWidth && "lg:w-[calc(50%-0.75rem)] inline-block align-top mr-6 last:mr-0")}
                >
                  {WIDGET_COMPONENTS[widget.id]}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
