import * as React from "react"
import { animate, createTimeline } from "animejs"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "./Button"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Drawer({ isOpen, onClose, title, description, children, footer }: DrawerProps) {
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
          translateX: ["0%", "100%"],
          duration: 300,
          ease: 'easeInCubic'
        });
      }
      
      if (overlayRef.current) {
        tl.add(overlayRef.current, {
          opacity: [1, 0],
          duration: 300,
          ease: 'linear'
        }, 0);
      }

      tl.then(() => {
        setShouldRender(false);
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && contentRef.current && overlayRef.current) {
      // Opening animation
      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 300,
        ease: 'linear'
      });
      
      animate(contentRef.current, {
        translateX: ["100%", "0%"],
        duration: 400,
        ease: 'easeOutExpo' // High-end spring-like feel
      });
    }
  }, [isOpen, shouldRender]);

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
    <div className="fixed inset-0 z-[400]" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm opacity-0"
      />
      
      {/* Drawer Content */}
      <div
        ref={contentRef}
        className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-md border-l border-border bg-card p-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] overflow-y-auto translate-x-full"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1">
            {children}
          </div>
          
          {footer && (
            <div className="mt-auto pt-6 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
