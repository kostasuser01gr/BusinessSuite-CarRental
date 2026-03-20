import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { cn } from "../../utils/cn"

export function StatTile({
  title,
  value,
  icon,
  trend,
  trendValue,
  className
}: {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-50">{value}</div>
        {trendValue && (
          <p className="text-xs mt-1">
            <span
              className={cn(
                "font-medium",
                trend === "up" ? "text-emerald-500" : "",
                trend === "down" ? "text-red-500" : "",
                trend === "neutral" ? "text-zinc-500" : ""
              )}
            >
              {trendValue}
            </span>{" "}
            <span className="text-zinc-500">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
