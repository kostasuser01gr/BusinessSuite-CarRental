import { useState, useEffect } from 'react';
import { useToast } from '../providers/ToastProvider';
import { globalEventBus, SYSTEM_EVENTS } from '../lib/eventBus';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { addToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      globalEventBus.emit(SYSTEM_EVENTS.NETWORK_ONLINE);
      addToast('Back online. Synchronizing data...', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      globalEventBus.emit(SYSTEM_EVENTS.NETWORK_OFFLINE);
      addToast('You are offline. Changes will be queued.', 'warning', 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  return isOnline;
}
