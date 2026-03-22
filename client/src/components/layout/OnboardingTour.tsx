import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { useOnboarding } from '../../providers/OnboardingProvider'
import { Button } from '../ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card'
import { X, ChevronRight, Check, Loader2 } from 'lucide-react'

const TOUR_STEPS = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    content: 'Access all your suite modules from here. The sidebar can be collapsed with Cmd+B.',
    position: 'right'
  },
  {
    target: '[data-tour="search"]',
    title: 'Command Palette',
    content: 'Press Cmd+K anywhere to search for customers, tasks, or navigate instantly.',
    position: 'bottom'
  },
  {
    target: '[data-tour="kpi-container"]',
    title: 'Business Insights',
    content: 'Real-time metrics and growth trends at a glance with animated sparklines.',
    position: 'bottom'
  },
  {
    target: '[data-tour="tasks-module"]',
    title: 'Interactive Task',
    content: 'Try adding a new task above to see how the system tracks your goals in real-time.',
    position: 'left',
    interactive: true
  }
]

export function OnboardingTour() {
  const { isActive, step, isWaitingForAction, nextStep, endTour, completeTour, setIsWaiting } = useOnboarding()
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const highlightRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentStepData = TOUR_STEPS[step - 1]

  useEffect(() => {
    if (isActive && currentStepData) {
      const el = document.querySelector(currentStepData.target)
      if (el) {
        const rect = el.getBoundingClientRect()
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        })

        if (highlightRef.current) {
          animate(highlightRef.current, {
            top: rect.top + window.scrollY - 8,
            left: rect.left + window.scrollX - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            duration: 600,
            easing: 'easeOutQuart'
          })
        }

        if (cardRef.current) {
          animate(cardRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 400,
            easing: 'easeOutCubic'
          })
        }

        if (currentStepData.interactive) {
          setIsWaiting(true)
        }
      }
    }
  }, [isActive, step, currentStepData, setIsWaiting])

  if (!isActive || !currentStepData) return null

  const isLastStep = step === TOUR_STEPS.length

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] pointer-events-auto" onClick={endTour} />
      
      <div 
        ref={highlightRef}
        className="absolute border-2 border-primary rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] z-[301] transition-shadow duration-500"
        style={{
          top: coords.top - 8,
          left: coords.left - 8,
          width: coords.width + 16,
          height: coords.height + 16
        }}
      />

      <div 
        ref={cardRef}
        className="absolute z-[302] pointer-events-auto w-[320px]"
        style={{
          top: coords.top + coords.height + 24,
          left: Math.max(20, Math.min(window.innerWidth - 340, coords.left + (coords.width / 2) - 160))
        }}
      >
        <Card className="border-primary/20 shadow-2xl bg-card/95 backdrop-blur-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-primary text-sm uppercase tracking-wider font-bold">
              {currentStepData.title}
            </CardTitle>
            <button onClick={endTour} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {currentStepData.content}
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`h-1 w-4 rounded-full ${i + 1 === step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            <Button 
              size="sm" 
              onClick={isLastStep ? completeTour : nextStep} 
              className="gap-2"
              disabled={isWaitingForAction}
            >
              {isWaitingForAction ? (
                <><span>Waiting...</span><Loader2 className="h-4 w-4 animate-spin" /></>
              ) : isLastStep ? (
                <><span>Finish</span><Check className="h-4 w-4" /></>
              ) : (
                <><span>Next</span><ChevronRight className="h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
