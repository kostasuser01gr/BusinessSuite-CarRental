import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Activity as ActivityType } from '../../../../shared/types'
import { LogIn, CheckCircle2, StickyNote, ShieldAlert } from 'lucide-react'

const ACTIVITIES: ActivityType[] = [
  { id: '1', time: '2 hours ago', text: 'New enterprise subscription created', user: 'Alice M.', type: 'system' },
  { id: '2', time: '4 hours ago', text: 'Completed "Q4 Roadmap Review"', user: 'You', type: 'task' },
  { id: '3', time: '5 hours ago', text: 'Logged in from new device: Chrome on macOS', user: 'You', type: 'auth' },
  { id: '4', time: 'Yesterday', text: 'Added note: "Client Feedback"', user: 'Charlie D.', type: 'note' },
]

export function ActivityTimelineModule() {
  const getIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'auth': return <ShieldAlert className="h-4 w-4 text-amber-500" />
      case 'task': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'note': return <StickyNote className="h-4 w-4 text-blue-500" />
      default: return <LogIn className="h-4 w-4 text-zinc-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-2 before:h-full before:w-[1px] before:bg-zinc-800 before:content-['']">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-4 pl-6 group">
              <div className="absolute left-0 top-1 mt-0.5 h-4 w-4 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center z-10">
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">
                  {activity.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium">{activity.user}</span>
                  <span>·</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
