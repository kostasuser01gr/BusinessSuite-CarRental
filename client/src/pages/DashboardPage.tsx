import { useState, useEffect, useRef } from "react"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Download, Edit3, Check, EyeOff, GripVertical, Sparkles, HelpCircle } from "lucide-react"
import { KPIModule } from "../components/dashboard/KPIModule"
import { TasksModule } from "../components/dashboard/TasksModule"
import { NotesModule } from "../components/dashboard/NotesModule"
import { AssistantModule } from "../components/dashboard/AssistantModule"
import { ActivityTimelineModule } from "../components/dashboard/ActivityTimelineModule"
import { InsightsModule } from "../components/dashboard/InsightsModule"
import { usePreferences, DashboardWidget } from "../providers/PreferencesProvider"
import { Reorder } from "framer-motion"
import { cn } from "../utils/cn"
import { useAuth } from "../providers/AuthProvider"
import { useOnboarding } from "../providers/OnboardingProvider"
import { useToast } from "../providers/ToastProvider"
import { animateHeroSequence, animateStaggeredReveal } from "../animations"

const WIDGET_COMPONENTS: Record<string, React.ReactNode> = {
  'kpi': <KPIModule />,
  'tasks': <TasksModule />,
  'notes': <NotesModule />,
  'assistant': <div className="h-[450px]"><AssistantModule /></div>,
  'timeline': <ActivityTimelineModule />,
  'insights': <InsightsModule />,
}

export default function DashboardPage() {
  const { widgets, setWidgets } = usePreferences()
  const { user } = useAuth()
  const { startTour } = useOnboarding()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const actionRowRef = useRef<HTMLDivElement>(null)

  // Sync local state for reordering to avoid lag
  const [localWidgets, setLocalWidgets] = useState(widgets)

  useEffect(() => {
    if (!isEditing) {
      // Ensure 'insights' is in the default set if not present
      const hasInsights = widgets.some(w => w.id === 'insights')
      if (!hasInsights) {
        setWidgets([...widgets, { id: 'insights', visible: true, order: 5 }])
      }
      setLocalWidgets(widgets)
    }
  }, [widgets, isEditing, setWidgets])

  useEffect(() => {
    if (dashboardRef.current) {
      const heroNodes = {
        eyebrow: dashboardRef.current.querySelector('[data-hero-eyebrow]'),
        heading: dashboardRef.current.querySelector('[data-hero-heading]'),
        actions: actionRowRef.current,
        panels: dashboardRef.current.querySelectorAll('.widget-animate'),
      }

      animateHeroSequence(heroNodes)
    }

    const hasSeenTour = localStorage.getItem('adaptive_tour_completed')
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        addToast("New here? Take a quick tour of the suite.", "info", 8000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [addToast, localWidgets, isEditing])

  useEffect(() => {
    if (!isEditing && dashboardRef.current) {
      animateStaggeredReveal(dashboardRef.current.querySelectorAll('.widget-animate'), 72)
    }
  }, [isEditing, localWidgets])

  const handleReorder = (newOrder: DashboardWidget[]) => {
    setLocalWidgets(newOrder)
  }

  const saveLayout = () => {
    const updated = localWidgets.map((w, i) => ({ ...w, order: i }))
    setWidgets(updated)
    setIsEditing(false)
  }

  const toggleVisibility = (id: string) => {
    setLocalWidgets(localWidgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w))
  }

  return (
    <div className="flex flex-col gap-6 max-w-full" ref={dashboardRef}>
      <div className="flex flex-col gap-2 mb-2">
        <div data-hero-eyebrow className="header-animate opacity-0 flex items-center gap-2 text-primary font-medium text-sm">
          <Sparkles className="h-4 w-4" />
          <span>System active and optimized</span>
        </div>
        <div data-hero-heading className="header-animate opacity-0">
          <SectionHeader
            title={`Good morning, ${user?.name || 'User'}`}
            description="Welcome back. Here's an overview of your operations today."
            action={
              <div ref={actionRowRef} className="flex items-center gap-2 opacity-0">
                {isEditing ? (
                  <Button onClick={saveLayout} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Check className="h-4 w-4" />
                    <span>Save Layout</span>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={startTour} className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Tour</span>
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </>
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
        </div>
      </div>

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
          {localWidgets.filter(w => w.visible).sort((a, b) => a.order - b.order).map((widget) => {
            const isFullWidth = widget.id === 'kpi' || widget.id === 'assistant' || widget.id === 'insights';
            
            return (
              <div
                key={widget.id}
                className={cn("widget-animate opacity-0 w-full", !isFullWidth && "lg:w-[calc(50%-0.75rem)] inline-block align-top mr-6 last:mr-0")}
              >
                {WIDGET_COMPONENTS[widget.id]}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
