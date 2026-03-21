import { cn } from "../../utils/cn"

interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          {action}
        </div>
      )}
    </div>
  )
}
