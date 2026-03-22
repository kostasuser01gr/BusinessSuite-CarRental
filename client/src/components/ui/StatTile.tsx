import { Card, CardContent } from "./Card"
import { cn } from "../../utils/cn"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatTileProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  sparkline?: React.ReactNode
}

export function StatTile({ title, value, icon, trend, trendValue, className, sparkline }: StatTileProps) {
  return (
    <Card className={cn("overflow-hidden group hover:border-primary/50 transition-colors duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
            {trend && (
              <div className="mt-1 flex items-center gap-1">
                {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                {trend === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
                <span className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-emerald-500" : 
                  trend === "down" ? "text-red-500" : 
                  "text-muted-foreground"
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {sparkline && (
            <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              {sparkline}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
