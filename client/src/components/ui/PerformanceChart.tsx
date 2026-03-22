import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { cn } from '../../utils/cn'

interface Point {
  x: number
  y: number
}

interface PerformanceChartProps {
  data: number[]
  className?: string
  color?: string
  height?: number
  width?: number
}

export function PerformanceChart({ 
  data, 
  className, 
  color = 'hsl(var(--primary))', 
  height = 100, 
  width = 300 
}: PerformanceChartProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const areaRef = useRef<SVGPathElement>(null)
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const padding = 10
  const chartHeight = height - padding * 2
  const chartWidth = width - padding * 2

  const points: Point[] = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: height - padding - ((val - min) / (max - min || 1)) * chartHeight
  }))

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      pathRef.current.style.strokeDasharray = `${length}`
      pathRef.current.style.strokeDashoffset = `${length}`
      
      animate(pathRef.current, {
        strokeDashoffset: [length, 0],
        duration: 2000,
        easing: 'easeInOutQuart'
      })
    }

    if (areaRef.current) {
      animate(areaRef.current, {
        opacity: [0, 0.1],
        duration: 2500,
        easing: 'easeOutQuad'
      })
    }
  }, [linePath])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          ref={areaRef}
          d={areaPath}
          fill="url(#chartGradient)"
          className="opacity-0"
        />
        
        {/* Main line */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 4px 6px ${color}44)` }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="hsl(var(--background))"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-300 hover:r-5 cursor-pointer"
          />
        ))}
      </svg>
    </div>
  )
}
