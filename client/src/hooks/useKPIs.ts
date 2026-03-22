import { useQuery } from '@tanstack/react-query';
import { KPIData } from '../../../shared/types';

const fetchKPIs = async (): Promise<KPIData> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return {
    revenue: '$45,231',
    activeTasks: 12,
    productivityScore: 94,
    systemHealth: 99.9,
  };
};

export function useKPIs() {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: fetchKPIs,
  });
}
