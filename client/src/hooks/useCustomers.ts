import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from '../../../shared/types';
import { useToast } from '../providers/ToastProvider';
import { sonic } from '../lib/audio';
import { logSystemEvent } from './useAuditLogs';

const fetchCustomers = async (): Promise<Customer[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const stored = localStorage.getItem('customers');
  if (stored) return JSON.parse(stored);
  
  const initial: Customer[] = [
    { id: "C-001", name: "Acme Corp", email: "contact@acme.com", phone: "+1 (555) 123-4567", status: "active", segment: "Enterprise", lastContact: "2026-03-15" },
    { id: "C-002", name: "Global Tech", email: "info@globaltech.io", phone: "+1 (555) 987-6543", status: "prospect", segment: "SME", lastContact: "2026-03-20" },
    { id: "C-003", name: "Stark Industries", email: "pepper@stark.com", phone: "+1 (555) 000-1111", status: "active", segment: "Enterprise", lastContact: "2026-03-18" },
    { id: "C-004", name: "Wayne Ent", email: "bruce@wayne.com", phone: "+1 (555) 999-8888", status: "inactive", segment: "Enterprise", lastContact: "2025-12-10" },
    { id: "C-005", name: "Umbrella Corp", email: "hr@umbrella.com", phone: "+1 (555) 666-0000", status: "lead", segment: "Mid-Market", lastContact: "2026-03-21" },
  ];
  localStorage.setItem('customers', JSON.stringify(initial));
  return initial;
};

const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

export function useCustomers() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'id' | 'lastContact'>) => {
      const current = await fetchCustomers();
      const customer: Customer = {
        ...newCustomer,
        id: `C-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        lastContact: new Date().toISOString(),
      };
      const updated = [customer, ...current];
      saveCustomers(updated);
      logSystemEvent('CREATE', 'CUSTOMER', customer.id, customer);
      return customer;
    },
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      const previous = queryClient.getQueryData<Customer[]>(['customers']);
      const optimisticCustomer: Customer = {
        ...newCustomer,
        id: 'C-NEW',
        lastContact: new Date().toISOString(),
      };
      queryClient.setQueryData<Customer[]>(['customers'], (old) => [optimisticCustomer, ...(old || [])]);
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['customers'], context.previous);
      addToast('Failed to create customer', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onSuccess: () => {
      addToast('Customer added successfully', 'success');
      sonic.playSuccess();
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (updatedCustomer: Customer) => {
      const current = await fetchCustomers();
      const updated = current.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
      saveCustomers(updated);
      logSystemEvent('UPDATE', 'CUSTOMER', updatedCustomer.id, updatedCustomer);
      return updatedCustomer;
    },
    onMutate: async (updatedCustomer) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      const previous = queryClient.getQueryData<Customer[]>(['customers']);
      queryClient.setQueryData<Customer[]>(['customers'], (old) => 
        (old || []).map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['customers'], context.previous);
      addToast('Failed to update customer', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onSuccess: () => {
      addToast('Customer updated', 'info');
      sonic.playPop();
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchCustomers();
      const updated = current.filter(c => c.id !== id);
      saveCustomers(updated);
      logSystemEvent('DELETE', 'CUSTOMER', id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      const previous = queryClient.getQueryData<Customer[]>(['customers']);
      queryClient.setQueryData<Customer[]>(['customers'], (old) => (old || []).filter(c => c.id !== id));
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['customers'], context.previous);
      addToast('Failed to delete customer', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onSuccess: () => {
      addToast('Customer removed', 'warning');
      sonic.playError();
    },
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    createCustomer: createCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
  };
}
