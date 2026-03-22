import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Undo2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { sonic } from '../lib/audio';
import { Button } from '../components/ui/Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number, action?: ToastAction) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000, action?: ToastAction) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration, action };
    
    // Play sound based on toast type
    if (type === 'success') {
      sonic.playSuccess();
    } else if (type === 'error' || type === 'warning') {
      sonic.playError();
    } else {
      sonic.playPop();
    }
    
    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity && !action) { // Don't auto-dismiss if there's an action (like undo) unless requested
      setTimeout(() => {
        removeToast(id);
      }, duration);
    } else if (action && duration !== Infinity) {
      // Longer duration for actionable toasts
      setTimeout(() => {
        removeToast(id);
      }, duration * 2);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && toasts.length > 0) {
      const lastToast = containerRef.current.lastElementChild;
      if (lastToast) {
        animate(lastToast, {
          translateX: [100, 0],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutCubic',
        });
      }
    }
  }, [toasts.length]);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 right-4 z-[500] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleRemove = () => {
    if (ref.current) {
      animate(ref.current, {
        translateX: [0, 100],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInCubic',
        complete: onRemove,
      });
    } else {
      onRemove();
    }
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-primary" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-xl min-w-[320px] max-w-md relative overflow-hidden",
        "animate-in fade-in slide-in-from-right-10 duration-300"
      )}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-foreground">{toast.message}</div>
      
      {toast.action && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs font-bold gap-1 ml-2 border-primary/20 hover:bg-primary hover:text-primary-foreground"
          onClick={() => {
            toast.action!.onClick();
            handleRemove();
          }}
        >
          {toast.action.label === 'Undo' && <Undo2 className="h-3 w-3" />}
          {toast.action.label}
        </Button>
      )}

      <button
        onClick={handleRemove}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-1"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar for duration */}
      {(!toast.action || toast.duration !== Infinity) && (
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full origin-left"
          style={{
            animation: `shrink ${toast.action ? (toast.duration || 3000) * 2 : toast.duration || 3000}ms linear forwards`
          }}
        />
      )}
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
