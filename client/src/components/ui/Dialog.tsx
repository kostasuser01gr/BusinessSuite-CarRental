import * as React from "react"
import { animate, createTimeline } from "animejs"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "./Button"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export function Dialog({ isOpen, onClose, title, description, children, footer, maxWidth = "max-w-lg" }: DialogProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = React.useState(isOpen)

  // Focus trap logic
  React.useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Initial focus
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isOpen, shouldRender]);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else if (shouldRender) {
      // Closing animation
      const tl = createTimeline();
      
      if (contentRef.current) {
        tl.add(contentRef.current, {
          opacity: [1, 0],
          scale: [1, 0.95],
          translateY: [0, 10],
          duration: 200,
          ease: 'easeInCubic'
        })
      }
      
      if (overlayRef.current) {
        tl.add(overlayRef.current, {
          opacity: [1, 0],
          duration: 200,
          ease: 'linear'
        }, 0)
      }

      tl.then(() => {
        setShouldRender(false)
      })
    }
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen && contentRef.current && overlayRef.current) {
      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 300,
        ease: 'linear'
      })
      
      animate(contentRef.current, {
        opacity: [0, 1],
        scale: [0.95, 1],
        translateY: [10, 0],
        duration: 400,
        ease: 'easeOutExpo'
      })
    }
  }, [isOpen, shouldRender])

  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm opacity-0"
      />
      
      {/* Dialog Content */}
      <div
        ref={contentRef}
        className={cn(
          "relative w-full z-10 border border-border bg-card p-6 shadow-2xl rounded-2xl opacity-0 scale-95",
          maxWidth
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full -mt-1 -mr-2 text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1">
            {children}
          </div>
          
          {footer && (
            <div className="mt-6 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
