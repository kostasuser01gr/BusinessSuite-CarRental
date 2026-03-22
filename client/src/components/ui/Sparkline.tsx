import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, color = 'currentColor', height = 40, width = 120 }: SparklineProps) {
  const pathRef = useRef<SVGPathElement>(null)
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * height
    return `${x},${y}`
  })
  
  const pathData = `M ${points.join(' L ')}`

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      pathRef.current.style.strokeDasharray = `${length}`
      pathRef.current.style.strokeDashoffset = `${length}`
      
      animate(pathRef.current, {
        strokeDashoffset: [length, 0],
        duration: 1500,
        easing: 'easeInOutQuart',
        delay: 500,
      })
    }
  }, [pathData])

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_4px_rgba(0,0,0,0.1)]"
      />
    </svg>
  )
}
