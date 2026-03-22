import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { cn } from '../../utils/cn'

interface AnimatedIllustrationProps {
  className?: string
  type: 'empty-tasks' | 'no-search' | 'error'
}

export function AnimatedIllustration({ className, type }: AnimatedIllustrationProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return

    if (type === 'empty-tasks') {
      const floatItem = ref.current.querySelector('.float-item')
      if (floatItem) {
        animate(floatItem, {
          translateY: [-5, 5],
          duration: 2000,
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true,
        })
      }
      
      const lines = ref.current.querySelectorAll('.draw-line')
      lines.forEach((line, i) => {
        const length = (line as SVGPathElement).getTotalLength()
        ;(line as SVGElement).setAttribute('stroke-dasharray', String(length))
        animate(line, {
          strokeDashoffset: [length, 0],
          duration: 1000,
          delay: 500 + (i * 200),
          easing: 'easeOutQuart',
        })
      })
    }

    if (type === 'no-search') {
      const magnify = ref.current.querySelector('.magnify')
      if (magnify) {
        animate(magnify, {
          rotate: [-10, 10],
          translateX: [-2, 2],
          duration: 3000,
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true,
        })
      }
    }
  }, [type])

  if (type === 'empty-tasks') {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        className={cn("w-32 h-32", className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="25" y="20" width="50" height="65" rx="4" className="float-item stroke-muted-foreground/30" strokeWidth="2" />
        <path d="M40 15H60V25H40V15Z" className="float-item fill-muted/50 stroke-muted-foreground/30" strokeWidth="2" />
        <path d="M35 40H65" className="draw-line stroke-primary/40" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 55H65" className="draw-line stroke-primary/40" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 70H50" className="draw-line stroke-primary/40" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'no-search') {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        className={cn("w-32 h-32", className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="45" cy="45" r="25" className="magnify stroke-muted-foreground/30" strokeWidth="3" />
        <line x1="62" y1="62" x2="85" y2="85" className="magnify stroke-muted-foreground/30" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 35H50" className="stroke-primary/20" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 30V40" className="stroke-primary/20" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return null
}
