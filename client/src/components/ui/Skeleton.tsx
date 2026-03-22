import { cn } from "../../utils/cn"
import { useEffect, useRef } from "react"
import { animate } from "animejs"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      animate(ref.current, {
        opacity: [0.4, 0.8, 0.4],
        duration: 1500,
        easing: 'easeInOutQuad',
        loop: true,
      })
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("rounded-md bg-muted/40", className)}
      {...props}
    />
  )
}
