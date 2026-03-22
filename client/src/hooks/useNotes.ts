import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note } from '../../../shared/types';
import { useToast } from '../providers/ToastProvider';
import { sonic } from '../lib/audio';

const fetchNotes = async (): Promise<Note[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const stored = localStorage.getItem('notes');
  if (stored) return JSON.parse(stored);
  
  const initial: Note[] = [
    { id: '1', title: 'Weekly Sync', content: 'Discussed scaling requirements for primary database.', pinned: true, category: 'Internal', updatedAt: new Date().toISOString() },
    { id: '2', title: 'Client Feedback', content: 'Requested more granular RBAC for enterprise tier.', pinned: false, category: 'Product', updatedAt: new Date().toISOString() },
  ];
  localStorage.setItem('notes', JSON.stringify(initial));
  return initial;
};

const saveNotesToMockStorage = (notes: Note[]) => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

export function useNotes() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ title, content, category = 'General' }: { title: string; content: string; category?: string }) => {
      const current = await fetchNotes();
      const newNote: Note = {
        id: Math.random().toString(36).substring(7),
        title,
        content,
        pinned: false,
        category,
        updatedAt: new Date().toISOString(),
      };
      const updated = [newNote, ...current];
      saveNotesToMockStorage(updated);
      return updated;
    },
    onMutate: async (newNoteData) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData<Note[]>(['notes']);
      
      const optimisticNote: Note = {
        id: 'note-new',
        title: newNoteData.title,
        content: newNoteData.content,
        pinned: false,
        category: newNoteData.category || 'General',
        updatedAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData<Note[]>(['notes'], (old) => [optimisticNote, ...(old || [])]);
      
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['notes'], context.previous);
      addToast('Failed to save note', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSuccess: () => {
      addToast('Note saved', 'success');
      sonic.playSuccess();
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchNotes();
      const updated = current.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      saveNotesToMockStorage(updated);
      return updated;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData<Note[]>(['notes']);
      
      queryClient.setQueryData<Note[]>(['notes'], (old) => 
        (old || []).map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
      );
      
      sonic.playPop();
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['notes'], context.previous);
      addToast('Failed to update pin', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSuccess: (_, id) => {
      const note = queryClient.getQueryData<Note[]>(['notes'])?.find(n => n.id === id);
      if (note) {
        addToast(`Note ${note.pinned ? 'pinned' : 'unpinned'}`, 'info');
      }
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchNotes();
      const updated = current.filter(n => n.id !== id);
      saveNotesToMockStorage(updated);
      return updated;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData<Note[]>(['notes']);
      queryClient.setQueryData<Note[]>(['notes'], (old) => (old || []).filter(n => n.id !== id));
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['notes'], context.previous);
      addToast('Failed to delete note', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSuccess: () => {
      addToast('Note deleted', 'info');
      sonic.playError();
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const current = await fetchNotes();
      const updated = current.map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n);
      saveNotesToMockStorage(updated);
      return updated;
    },
    onMutate: async ({ id, title, content }) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData<Note[]>(['notes']);
      queryClient.setQueryData<Note[]>(['notes'], (old) => 
        (old || []).map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n)
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) queryClient.setQueryData(['notes'], context.previous);
      addToast('Failed to update note', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSuccess: () => {
      addToast('Note updated', 'success');
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    addNote: addNoteMutation.mutate,
    togglePin: togglePinMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
  };
}
