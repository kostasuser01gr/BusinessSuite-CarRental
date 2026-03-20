import * as React from "react"
import { cn } from "../../utils/cn"

export function SectionHeader({
  title,
  description,
  action,
  className
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{title}</h2>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
      {action && <div className="mt-2 md:mt-0">{action}</div>}
    </div>
  )
}
