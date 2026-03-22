import { ReactNode } from 'react'
import { AnimatedIllustration } from './AnimatedIllustration'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  illustration: 'empty-tasks' | 'no-search' | 'error'
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, illustration, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500", className)}>
      <AnimatedIllustration type={illustration} className="mb-6" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
