import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, BookingStatus } from '../../../shared/types';
import { useToast } from '../providers/ToastProvider';
import { sonic } from '../lib/audio';

const fetchBookings = async (): Promise<Booking[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const stored = localStorage.getItem('bookings');
  if (stored) return JSON.parse(stored);
  
  const initial: Booking[] = [
    { id: "BK-1001", customerId: "C-001", customerName: "Acme Corp", status: "confirmed", date: "2026-03-22T10:00:00Z", value: "$1,200", serviceType: "Fleet Delivery" },
    { id: "BK-1002", customerId: "C-005", customerName: "Globex Inc", status: "pending", date: "2026-03-22T14:30:00Z", value: "$850", serviceType: "Maintenance" },
    { id: "BK-1003", customerId: "C-002", customerName: "Stark Industries", status: "confirmed", date: "2026-03-23T09:00:00Z", value: "$2,400", serviceType: "Strategic Consulting" },
    { id: "BK-1004", customerId: "C-003", customerName: "Wayne Ent", status: "cancelled", date: "2026-03-21T11:00:00Z", value: "$500", serviceType: "Standard Audit" },
    { id: "BK-1005", customerId: "C-004", customerName: "Umbrella Co", status: "completed", date: "2026-03-20T16:00:00Z", value: "$3,100", serviceType: "Hazardous Materials" },
  ];
  localStorage.setItem('bookings', JSON.stringify(initial));
  return initial;
};

const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

export function useBookings() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (newBooking: Omit<Booking, 'id'>) => {
      const current = await fetchBookings();
      const booking: Booking = {
        ...newBooking,
        id: `BK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      };
      const updated = [booking, ...current];
      saveBookings(updated);
      return booking;
    },
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      const previous = queryClient.getQueryData<Booking[]>(['bookings']);
      const optimisticBooking: Booking = {
        ...newBooking,
        id: 'BK-NEW',
      };
      queryClient.setQueryData<Booking[]>(['bookings'], (old) => [optimisticBooking, ...(old || [])]);
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['bookings'], context.previous);
      addToast('Failed to create booking', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onSuccess: () => {
      addToast('Booking created successfully', 'success');
      sonic.playSuccess();
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const current = await fetchBookings();
      const updated = current.map(b => b.id === id ? { ...b, status } : b);
      saveBookings(updated);
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      const previous = queryClient.getQueryData<Booking[]>(['bookings']);
      queryClient.setQueryData<Booking[]>(['bookings'], (old) => 
        (old || []).map(b => b.id === id ? { ...b, status } : b)
      );
      sonic.playPop();
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['bookings'], context.previous);
      addToast('Failed to update booking status', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onSuccess: () => {
      addToast('Booking status updated', 'info');
    },
  });

  return {
    bookings: bookingsQuery.data || [],
    isLoading: bookingsQuery.isLoading,
    isError: bookingsQuery.isError,
    createBooking: createBookingMutation.mutate,
    updateBookingStatus: updateBookingStatusMutation.mutate,
  };
}
