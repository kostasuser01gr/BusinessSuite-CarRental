import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { cn } from '../../utils/cn'

export function SystemPulse({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a grid of subtle dots
    const dots = containerRef.current.querySelectorAll('.pulse-dot')
    
    animate(dots, {
      opacity: [0.05, 0.15, 0.05],
      scale: [1, 1.2, 1],
      delay: stagger(200, { grid: [10, 10], from: 'center' }),
      duration: 3000,
      easing: 'easeInOutQuad',
      loop: true
    })
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={cn("absolute inset-0 pointer-events-none opacity-20 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="grid grid-cols-10 grid-rows-10 h-full w-full gap-8 p-8">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="pulse-dot w-1 h-1 rounded-full bg-primary opacity-5" 
          />
        ))}
      </div>
    </div>
  )
}
