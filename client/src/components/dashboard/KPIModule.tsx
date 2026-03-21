import { StatTile } from "../ui/StatTile"
import { DollarSign, CheckCircle2, Zap, ShieldCheck } from "lucide-react"

export function KPIModule() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatTile
        title="Total Revenue"
        value="$45,231.89"
        icon={<DollarSign className="h-4 w-4" />}
        trend="up"
        trendValue="+20.1%"
      />
      <StatTile
        title="Active Tasks"
        value="12"
        icon={<CheckCircle2 className="h-4 w-4" />}
        trend="neutral"
        trendValue="Steady"
      />
      <StatTile
        title="Productivity Score"
        value="94%"
        icon={<Zap className="h-4 w-4" />}
        trend="up"
        trendValue="+2.4%"
      />
      <StatTile
        title="System Health"
        value="99.9%"
        icon={<ShieldCheck className="h-4 w-4" />}
        trend="up"
        trendValue="Optimized"
      />
    </div>
  )
}
