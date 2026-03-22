import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { Plus, Zap, Mail, Database, ArrowRight, X, Play, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface Node {
  id: string
  type: 'trigger' | 'action' | 'condition'
  label: string
  x: number
  y: number
  icon: any
  color: string
}

const INITIAL_NODES: Node[] = [
  { id: 'n1', type: 'trigger', label: 'Asset Health < 40%', x: 50, y: 100, icon: Zap, color: 'text-amber-500' },
  { id: 'n2', type: 'action', label: 'Create Critical Task', x: 300, y: 100, icon: Plus, color: 'text-emerald-500' },
  { id: 'n3', type: 'action', label: 'Slack Notification', x: 550, y: 100, icon: Mail, color: 'text-purple-500' },
]

export function VisualWorkflowBuilder({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [isDragging, setIsDragging] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (canvasRef.current) {
      animate(canvasRef.current, {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        easing: 'easeOutExpo'
      })
      
      // Animate the drawing of connecting lines
      const paths = canvasRef.current.querySelectorAll('.connection-line')
      paths.forEach(p => {
        const length = (p as SVGPathElement).getTotalLength()
        p.setAttribute('stroke-dasharray', String(length))
        p.setAttribute('stroke-dashoffset', String(length))
        animate(p, {
          strokeDashoffset: [length, 0],
          duration: 1000,
          delay: 300,
          easing: 'easeInOutSine'
        })
      })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="fixed inset-0 z-[500] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Critical Asset Recovery</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Visual Canvas Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-bold border-primary/20 text-primary">
            <Play className="h-3 w-3" /> Test Run
          </Button>
          <Button size="sm" className="gap-2 h-8 text-xs font-bold" onClick={onClose}>
            <CheckCircle2 className="h-3 w-3" /> Save & Exit
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="flex-1 relative bg-muted/10 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div 
          ref={canvasRef}
          className="absolute inset-0 origin-center"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 2000, minHeight: 2000 }}>
            {nodes.slice(0, -1).map((node, i) => {
              const nextNode = nodes[i + 1]
              if (!nextNode) return null
              const startX = node.x + 200 // box width
              const startY = node.y + 40  // half box height
              const endX = nextNode.x
              const endY = nextNode.y + 40
              
              // Draw a bezier curve connecting them
              const path = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`
              
              return (
                <g key={`conn-${i}`}>
                  <path 
                    d={path} 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                    strokeOpacity="0.3"
                  />
                  <path 
                    className="connection-line"
                    d={path} 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                  />
                </g>
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div 
              key={node.id}
              className="absolute w-[200px] bg-card border border-border rounded-xl shadow-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
              style={{ left: node.x, top: node.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-muted", node.color.replace('text-', 'bg-').replace('-500', '-500/10'))}>
                <node.icon className={cn("h-5 w-5", node.color)} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider">{node.type}</span>
                <span className="text-sm font-bold text-foreground truncate">{node.label}</span>
              </div>
            </div>
          ))}

          {/* Add Step Button */}
          <div 
            className="absolute w-[200px] h-[82px] border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary group"
            style={{ left: nodes[nodes.length - 1].x + 250, top: nodes[nodes.length - 1].y }}
            onClick={(e) => e.stopPropagation()}
          >
            <Plus className="h-5 w-5 group-hover:scale-125 transition-transform" />
            <span className="text-sm font-bold">Add Step</span>
          </div>
        </div>
      </div>
      
      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-2xl flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl"><Database className="h-4 w-4 text-muted-foreground" /></Button>
        <Button variant="ghost" size="icon" className="rounded-xl"><Mail className="h-4 w-4 text-muted-foreground" /></Button>
        <div className="w-[1px] h-6 bg-border self-center mx-2" />
        <Button variant="ghost" size="icon" className="rounded-xl"><Zap className="h-4 w-4 text-amber-500" /></Button>
      </div>
    </div>
  )
}
