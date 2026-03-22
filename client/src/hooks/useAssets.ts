import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Asset } from '../../../shared/types';
import { useToast } from '../providers/ToastProvider';
import { sonic } from '../lib/audio';
import { logSystemEvent } from './useAuditLogs';

const fetchAssets = async (): Promise<Asset[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const stored = localStorage.getItem('assets');
  if (stored) return JSON.parse(stored);
  
  const initial: Asset[] = [
    { id: "AST-001", name: "Delivery Van #12", type: "Vehicle", status: "available", health: 95, location: "San Francisco, CA" },
    { id: "AST-002", name: "Industrial Drone X1", type: "UAV", status: "in-use", health: 82, location: "Oakland, CA" },
    { id: "AST-003", name: "Forklift Alpha", type: "Heavy Machinery", status: "maintenance", health: 45, location: "Warehouse A" },
    { id: "AST-004", name: "Server Rack 04", type: "IT Infrastructure", status: "available", health: 99, location: "Data Center 1" },
    { id: "AST-005", name: "Delivery Van #15", type: "Vehicle", status: "in-use", health: 88, location: "San Jose, CA" },
  ];
  localStorage.setItem('assets', JSON.stringify(initial));
  return initial;
};

const saveAssets = (assets: Asset[]) => {
  localStorage.setItem('assets', JSON.stringify(assets));
};

export function useAssets() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const assetsQuery = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  const createAssetMutation = useMutation({
    mutationFn: async (newAsset: Omit<Asset, 'id'>) => {
      const current = await fetchAssets();
      const asset: Asset = {
        ...newAsset,
        id: `AST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      };
      const updated = [...current, asset];
      saveAssets(updated);
      logSystemEvent('CREATE', 'ASSET', asset.id, asset);
      return asset;
    },
    onMutate: async (newAsset) => {
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      const previous = queryClient.getQueryData<Asset[]>(['assets']);
      const optimisticAsset: Asset = {
        ...newAsset,
        id: 'AST-NEW',
      };
      queryClient.setQueryData<Asset[]>(['assets'], (old) => [...(old || []), optimisticAsset]);
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['assets'], context.previous);
      addToast('Failed to create asset', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
    onSuccess: () => {
      addToast('Asset registered successfully', 'success');
      sonic.playSuccess();
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: async (updatedAsset: Asset) => {
      const current = await fetchAssets();
      const updated = current.map(a => a.id === updatedAsset.id ? updatedAsset : a);
      saveAssets(updated);
      logSystemEvent('UPDATE', 'ASSET', updatedAsset.id, updatedAsset);
      return updatedAsset;
    },
    onMutate: async (updatedAsset) => {
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      const previous = queryClient.getQueryData<Asset[]>(['assets']);
      queryClient.setQueryData<Asset[]>(['assets'], (old) => 
        (old || []).map(a => a.id === updatedAsset.id ? updatedAsset : a)
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['assets'], context.previous);
      addToast('Failed to update asset', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
    onSuccess: () => {
      addToast('Asset updated', 'info');
      sonic.playPop();
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchAssets();
      const updated = current.filter(a => a.id !== id);
      saveAssets(updated);
      logSystemEvent('DELETE', 'ASSET', id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      const previous = queryClient.getQueryData<Asset[]>(['assets']);
      queryClient.setQueryData<Asset[]>(['assets'], (old) => (old || []).filter(a => a.id !== id));
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['assets'], context.previous);
      addToast('Failed to delete asset', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
    onSuccess: () => {
      addToast('Asset removed', 'warning');
      sonic.playError();
    },
  });

  return {
    assets: assetsQuery.data || [],
    isLoading: assetsQuery.isLoading,
    isError: assetsQuery.isError,
    createAsset: createAssetMutation.mutate,
    updateAsset: updateAssetMutation.mutate,
    deleteAsset: deleteAssetMutation.mutate,
  };
}
