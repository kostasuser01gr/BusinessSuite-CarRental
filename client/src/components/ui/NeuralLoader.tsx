import { useEffect, useRef } from 'react'
import { animate, stagger, createTimeline } from 'animejs'
import { cn } from '../../utils/cn'

export function NeuralLoader({ className }: { className?: string }) {
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = createTimeline({
      loop: true,
      alternate: true
    })

    // 1. Pulse the nodes
    tl.add(containerRef.current.querySelectorAll('.node'), {
      scale: [1, 1.2, 1],
      opacity: [0.4, 1, 0.4],
      delay: stagger(100),
      duration: 1000,
      ease: 'easeInOutSine'
    })

    // 2. Animate the connecting paths (drawing effect)
    animate(containerRef.current.querySelectorAll('.link'), {
      strokeDashoffset: [40, 0],
      opacity: [0.1, 0.5, 0.1],
      delay: stagger(50),
      duration: 1500,
      ease: 'easeInOutQuad',
      loop: true
    })
  }, [])

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 100 40"
      className={cn("w-24 h-10 overflow-visible", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Neural Links */}
      <path className="link" d="M10 20 L30 10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40" />
      <path className="link" d="M10 20 L30 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40" />
      <path className="link" d="M30 10 L60 20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40" />
      <path className="link" d="M30 30 L60 20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40" />
      <path className="link" d="M60 20 L90 20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="40" />

      {/* Neural Nodes */}
      <circle className="node" cx="10" cy="20" r="2" fill="currentColor" />
      <circle className="node" cx="30" cy="10" r="2" fill="currentColor" />
      <circle className="node" cx="30" cy="30" r="2" fill="currentColor" />
      <circle className="node" cx="60" cy="20" r="2" fill="currentColor" />
      <circle className="node" cx="90" cy="20" r="3" fill="currentColor" />
    </svg>
  )
}
