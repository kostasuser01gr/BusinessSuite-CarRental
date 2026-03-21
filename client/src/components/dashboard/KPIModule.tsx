import { StatTile } from "../ui/StatTile"
import { DollarSign, CheckCircle2, Zap, ShieldCheck, TrendingUp, Users } from "lucide-react"

export function KPIModule() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatTile
        title="Revenue"
        value="$45,231"
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
        title="Efficiency"
        value="94%"
        icon={<Zap className="h-4 w-4" />}
        trend="up"
        trendValue="+2.4%"
      />
      <StatTile
        title="System"
        value="99.9%"
        icon={<ShieldCheck className="h-4 w-4" />}
        trend="up"
        trendValue="Optimal"
      />
      <StatTile
        title="Growth"
        value="+12%"
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
        trendValue="Monthly"
      />
      <StatTile
        title="Users"
        value="1,284"
        icon={<Users className="h-4 w-4" />}
        trend="up"
        trendValue="+180"
      />
    </div>
  )
}
