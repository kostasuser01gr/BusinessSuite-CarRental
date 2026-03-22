import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
          <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground">System Anomaly</h1>
              <p className="text-muted-foreground leading-relaxed">
                An unexpected execution error has occurred. Our recovery agent has been notified.
              </p>
              {this.state.error && (
                <pre className="mt-4 p-4 rounded-xl bg-muted text-[10px] font-mono text-left overflow-auto max-h-32 opacity-70 border border-border">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="gap-2 shadow-lg shadow-primary/20"
              >
                <RefreshCw className="h-4 w-4" /> Hard Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard'}
                className="gap-2"
              >
                <Home className="h-4 w-4" /> Go Home
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
              Error Instance: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
