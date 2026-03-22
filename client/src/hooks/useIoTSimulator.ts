import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Asset } from '../../../shared/types';
import { globalEventBus, SYSTEM_EVENTS } from '../lib/eventBus';

/**
 * useIoTSimulator
 * Periodically fluctuates asset health scores to simulate real-time sensor data.
 */
export function useIoTSimulator(enabled: boolean = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      queryClient.setQueryData<Asset[]>(['assets'], (oldAssets) => {
        if (!oldAssets) return oldAssets;

        return oldAssets.map((asset) => {
          // Randomly fluctuate health by +/- 1-2 points
          const change = Math.floor(Math.random() * 5) - 2;
          const newHealth = Math.max(0, Math.min(100, asset.health + change));
          
          if (newHealth !== asset.health && newHealth < 60 && asset.health >= 60) {
            // Emit anomaly event if health drops below threshold
            globalEventBus.emit(SYSTEM_EVENTS.QUICK_ACTION_TRIGGERED, { 
              action: 'anomaly_detected', 
              payload: { assetId: asset.id, name: asset.name, health: newHealth } 
            });
          }

          return { ...asset, health: newHealth };
        });
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enabled, queryClient]);
}
