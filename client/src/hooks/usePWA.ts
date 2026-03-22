import { useState, useEffect } from 'react';
import { useToast } from '../providers/ToastProvider';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      addToast('AdaptiveAI is ready to be installed for offline use', 'info', 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed or running as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [addToast]);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      addToast('Installing AdaptiveAI Suite...', 'success');
    } else {
      addToast('Installation cancelled', 'warning');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
}
