import { useEffect, useState, useRef } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Download, Monitor, Smartphone, Zap, ShieldCheck, WifiOff } from 'lucide-react';
import { animate, createTimeline } from 'animejs';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isOpen, setIsOpen] = useState(false);
  const hasPrompted = useRef(false);

  useEffect(() => {
    // Auto-prompt once if installable, after a short delay
    if (isInstallable && !hasPrompted.current && !localStorage.getItem('adaptive_install_dismissed')) {
      hasPrompted.current = true;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleDismiss = () => {
    localStorage.setItem('adaptive_install_dismissed', 'true');
    setIsOpen(false);
  };

  const handleInstall = async () => {
    setIsOpen(false);
    await installApp();
  };

  if (!isInstallable) return null;

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={handleDismiss}
      title="Install AdaptiveAI Suite"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 pt-2">
        <div className="flex justify-center py-4 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
          <div className="relative h-20 w-20 bg-background border-2 border-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
            <div className="h-10 w-10 bg-primary text-primary-foreground font-black flex items-center justify-center rounded-lg text-2xl">
              A
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Install the AdaptiveAI Business Suite directly to your device for a native, unrestricted experience across all operating systems.
          </p>
        </div>

        <div className="grid gap-3">
          {[
            { icon: Zap, title: "Zero Latency", desc: "Hardware-accelerated performance." },
            { icon: WifiOff, title: "Local-First Sync", desc: "Full offline capabilities with background sync." },
            { icon: ShieldCheck, title: "Secure Sandbox", desc: "Isolated environment for enterprise data." },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <feature.icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{feature.title}</span>
                <span className="text-[10px] text-muted-foreground">{feature.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button 
            className="w-full h-11 text-sm font-bold tracking-wider uppercase shadow-lg shadow-primary/20"
            onClick={handleInstall}
          >
            <Download className="h-4 w-4 mr-2" />
            Install Application
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-xs text-muted-foreground"
            onClick={handleDismiss}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
