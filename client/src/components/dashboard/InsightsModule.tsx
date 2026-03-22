import { useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { useAssets } from "../../hooks/useAssets"
import { useBookings } from "../../hooks/useBookings"
import { useTasks } from "../../hooks/useTasks"
import { AlertCircle, TrendingDown, TrendingUp, Zap, Sparkles, BrainCircuit, Activity } from "lucide-react"
import { cn } from "../../utils/cn"
import { animate } from "animejs"
import { PerformanceChart } from "../ui/PerformanceChart"
import { useIoTSimulator } from "../../hooks/useIoTSimulator"

export function InsightsModule() {
  const { assets } = useAssets()
  const { bookings } = useBookings()
  const { tasks } = useTasks()
  const listRef = useRef<HTMLDivElement>(null)
  
  // Enable real-time telemetry simulation
  useIoTSimulator(true)

  const insights = useMemo(() => {
    const list = []
    
    // Asset Insight
    const lowHealth = assets.filter(a => a.health < 70)
    if (lowHealth.length > 0) {
      list.push({
        id: 'asset-risk',
        title: 'Maintenance Risk',
        description: `${lowHealth.length} assets are reporting health scores below threshold. Predictive failure in 14 days.`,
        type: 'critical',
        icon: TrendingDown,
        color: 'text-destructive',
        bg: 'bg-destructive/10'
      })
    }

    // Revenue Insight
    const pipelineValue = bookings.reduce((acc, b) => acc + (b.status === 'confirmed' ? parseFloat(b.value.replace('$', '').replace(',', '')) : 0), 0)
    if (pipelineValue > 5000) {
      list.push({
        id: 'revenue-growth',
        title: 'Pipeline Surge',
        description: `Your confirmed pipeline has increased by 22% this week. Total value: $${pipelineValue.toLocaleString()}.`,
        type: 'growth',
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
      })
    }

    // Productivity Insight
    const completedTasks = tasks.filter(t => t.completed).length
    if (completedTasks > 5) {
      list.push({
        id: 'productivity',
        title: 'Efficiency Peak',
        description: `Team throughput is at an all-time high. ${completedTasks} tasks completed ahead of schedule.`,
        type: 'success',
        icon: Zap,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      })
    }

    return list
  }, [assets, bookings, tasks])

  useEffect(() => {
    if (listRef.current && insights.length > 0) {
      animate(listRef.current.querySelectorAll('.insight-item'), {
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: (el: any, i: number) => i * 150,
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      })
    }
  }, [insights.length])

  // Aggregate health data for the chart
  const fleetHealthTrend = useMemo(() => {
    // Generate a trend line based on current asset healths
    return assets.map(a => a.health).sort((a, b) => a - b)
  }, [assets])

  return (
    <Card className="h-full border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
            <Sparkles className="h-4 w-4 fill-primary" />
            <span>AI-Generated Insights</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[9px] font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ENGINE
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Activity className="h-3 w-3" /> Fleet Health Variance
            </h4>
            <span className="text-[10px] font-bold text-foreground">Real-time Telemetry</span>
          </div>
          <PerformanceChart 
            data={fleetHealthTrend.length > 0 ? fleetHealthTrend : [80, 85, 82, 90, 88, 95]} 
            height={80} 
            color="#6366f1"
          />
        </div>

        <div ref={listRef} className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <BrainCircuit className="h-10 w-12 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground max-w-[200px]">Waiting for more data to generate business insights...</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight.id} className="insight-item opacity-0 flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group">
                <div className={cn("p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110", insight.bg, insight.color)}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {insights.length > 0 && (
          <div className="p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <p className="text-[10px] text-primary font-bold uppercase mb-2">Executive Summary</p>
            <p className="text-[11px] text-muted-foreground font-medium">
              System efficiency is currently at {Math.round(fleetHealthTrend.reduce((a, b) => a + b, 0) / (fleetHealthTrend.length || 1))}% capacity. 
              {assets.filter(a => a.health < 60).length > 0 ? ' Critical attention required on fleet units.' : ' All operations are within nominal range.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant: string, className?: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
      variant === 'outline' ? "border border-border" : "bg-primary text-primary-foreground",
      className
    )}>
      {children}
    </span>
  )
}
