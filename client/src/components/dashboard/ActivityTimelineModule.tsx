import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Activity as ActivityType } from '../../../../shared/types'
import { CheckCircle2, StickyNote, ShieldAlert, Zap, UserPlus } from 'lucide-react'
import { animateStaggeredReveal } from '../../animations'
import { animate } from 'animejs'
import { globalEventBus, SYSTEM_EVENTS } from '../../lib/eventBus'
import { cn } from '../../utils/cn'

const INITIAL_ACTIVITIES: ActivityType[] = [
  { id: '1', time: '2 hours ago', text: 'New enterprise subscription created', user: 'Alice M.', type: 'system' },
  { id: '2', time: '4 hours ago', text: 'Completed "Q4 Roadmap Review"', user: 'You', type: 'task' },
  { id: '3', time: '5 hours ago', text: 'Logged in from new device: Chrome on macOS', user: 'You', type: 'auth' },
  { id: '4', time: 'Yesterday', text: 'Added note: "Client Feedback"', user: 'Charlie D.', type: 'note' },
]

export function ActivityTimelineModule() {
  const [activities, setActivities] = useState<ActivityType[]>(INITIAL_ACTIVITIES)
  const listRef = useRef<HTMLDivElement>(null)
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current && listRef.current) {
      const items = listRef.current.querySelectorAll('.activity-item-animate')
      animateStaggeredReveal(items, 60)
      initialRender.current = false
    }
  }, [])

  useEffect(() => {
    // Listen for global events to simulate real-time activity feed
    const handleTaskCreated = () => {
      const newActivity: ActivityType = {
        id: Math.random().toString(36),
        time: 'Just now',
        text: 'Created a new task',
        user: 'You',
        type: 'task'
      }
      setActivities(prev => [newActivity, ...prev.slice(0, 4)])
      
      // Animate the new item coming in
      setTimeout(() => {
        if (listRef.current) {
          const firstItem = listRef.current.firstElementChild
          if (firstItem) {
            animate(firstItem, {
              opacity: [0, 1],
              translateX: [-20, 0],
              duration: 400,
              ease: 'easeOutCubic'
            })
          }
        }
      }, 50)
    }

    const handleTaskCompleted = () => {
      const newActivity: ActivityType = {
        id: Math.random().toString(36),
        time: 'Just now',
        text: 'Completed a task',
        user: 'You',
        type: 'task'
      }
      setActivities(prev => [newActivity, ...prev.slice(0, 4)])
      
      setTimeout(() => {
        if (listRef.current) {
          const firstItem = listRef.current.firstElementChild
          if (firstItem) {
            animate(firstItem, {
              opacity: [0, 1],
              translateX: [-20, 0],
              duration: 400,
              ease: 'easeOutCubic'
            })
          }
        }
      }, 50)
    }

    const unsubCreated = globalEventBus.on(SYSTEM_EVENTS.TASK_CREATED, handleTaskCreated)
    const unsubCompleted = globalEventBus.on(SYSTEM_EVENTS.TASK_COMPLETED, handleTaskCompleted)

    return () => {
      unsubCreated()
      unsubCompleted()
    }
  }, [])

  const getIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'auth': return <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
      case 'task': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      case 'note': return <StickyNote className="h-3.5 w-3.5 text-primary" />
      default: return <Zap className="h-3.5 w-3.5 text-muted-foreground" />
    }
  }

  return (
    <Card className="h-full bg-card border-border" data-testid="activity-timeline">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div ref={listRef} className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-[1px] before:bg-border before:content-[''] overflow-hidden">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={cn(
                "activity-item-animate relative flex items-start gap-4 pl-8 group",
                initialRender.current ? "opacity-0" : ""
              )}
            >
              <div className="absolute left-0 top-1 h-[22px] w-[22px] rounded-full bg-background border border-border flex items-center justify-center z-10 shadow-sm group-hover:border-primary/50 transition-colors">
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-none">
                  {activity.text}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1 font-medium bg-muted px-1.5 py-0.5 rounded">
                    <UserPlus className="h-2.5 w-2.5" />
                    <span>{activity.user}</span>
                  </div>
                  <span className="opacity-50">·</span>
                  <span className="font-medium italic">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
