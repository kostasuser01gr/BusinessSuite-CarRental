import { useEffect, useRef } from "react"
import { StatTile } from "../ui/StatTile"
import { DollarSign, CheckCircle2, Zap, ShieldCheck, TrendingUp, Users } from "lucide-react"
import { animateStaggeredReveal } from "../../animations"
import { useKPIs } from "../../hooks/useKPIs"
import { Skeleton } from "../ui/Skeleton"
import { Sparkline } from "../ui/Sparkline"

export function KPIModule() {
  const { data, isLoading } = useKPIs()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && !isLoading) {
      const tiles = containerRef.current.querySelectorAll('.stat-tile-item')
      tiles.forEach((el) => { (el as HTMLElement).style.opacity = '0' })
      animateStaggeredReveal(tiles, 50)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" data-testid="kpi-container" data-tour="kpi-container">
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="Revenue"
          value={data?.revenue || '$0'}
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          trendValue="+20.1%"
          sparkline={<Sparkline data={[30, 40, 35, 50, 49, 60, 70, 91]} color="#10b981" />}
        />
      </div>
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="Active Tasks"
          value={String(data?.activeTasks || 0)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="neutral"
          trendValue="Steady"
          sparkline={<Sparkline data={[10, 15, 8, 12, 11, 14, 12]} color="#6366f1" />}
        />
      </div>
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="Efficiency"
          value={`${data?.productivityScore || 0}%`}
          icon={<Zap className="h-4 w-4" />}
          trend="up"
          trendValue="+2.4%"
          sparkline={<Sparkline data={[85, 88, 87, 90, 92, 94]} color="#f59e0b" />}
        />
      </div>
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="System"
          value={`${data?.systemHealth || 0}%`}
          icon={<ShieldCheck className="h-4 w-4" />}
          trend="up"
          trendValue="Optimal"
          sparkline={<Sparkline data={[99.5, 99.8, 99.9, 99.7, 99.9, 100]} color="#10b981" />}
        />
      </div>
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="Growth"
          value="+12%"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          trendValue="Monthly"
          sparkline={<Sparkline data={[5, 7, 8, 10, 11, 12]} color="#10b981" />}
        />
      </div>
      <div className="stat-tile-item opacity-0">
        <StatTile
          title="Users"
          value="1,284"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue="+180"
          sparkline={<Sparkline data={[1000, 1100, 1150, 1200, 1250, 1284]} color="#6366f1" />}
        />
      </div>
    </div>
  )
}
