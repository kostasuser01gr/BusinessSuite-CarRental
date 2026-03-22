import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../../../shared/types';
import { useToast } from '../providers/ToastProvider';
import { globalEventBus, SYSTEM_EVENTS } from '../lib/eventBus';
import { sonic } from '../lib/audio';

// Mock API for Tasks
const fetchTasks = async (): Promise<Task[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const stored = localStorage.getItem('tasks');
  if (stored) return JSON.parse(stored);
  
  const initial: Task[] = [
    { id: '1', title: 'Review Q4 roadmap', completed: false, priority: 'high', createdAt: new Date().toISOString(), dueDate: '2026-03-25' },
    { id: '2', title: 'Approve new hires', completed: false, priority: 'medium', createdAt: new Date().toISOString(), dueDate: '2026-03-22' },
    { id: '3', title: 'Update privacy policy', completed: true, priority: 'low', createdAt: new Date().toISOString() },
  ];
  localStorage.setItem('tasks', JSON.stringify(initial));
  return initial;
};

const saveTasksToMockStorage = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export function useTasks() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const undeleteTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const current = await fetchTasks();
      const updated = [task, ...current];
      saveTasksToMockStorage(updated);
      return updated;
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [task, ...(old || [])]);
      sonic.playPop();
      return { previousTasks };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      addToast('Task restored', 'success');
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const current = await fetchTasks();
      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        title,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
      };
      const updated = [newTask, ...current];
      saveTasksToMockStorage(updated);
      return updated;
    },
    onMutate: async (newTitle) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      const optimisticTask: Task = {
        id: Math.random().toString(36).substring(7),
        title: newTitle,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [optimisticTask, ...(old || [])]);
      
      return { previousTasks };
    },
    onError: (error: any, _newTitle, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      addToast(error.message || 'Failed to create task', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      addToast('Task created successfully', 'success');
      globalEventBus.emit(SYSTEM_EVENTS.TASK_CREATED);
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchTasks();
      const updated = current.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveTasksToMockStorage(updated);
      return updated;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        (old || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
      
      // Immediate feedback
      sonic.playPop();
      
      return { previousTasks };
    },
    onError: (_error, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      addToast('Failed to update task', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: (_, id) => {
      const task = queryClient.getQueryData<Task[]>(['tasks'])?.find(t => t.id === id);
      if (task) {
        addToast(`Task marked as ${task.completed ? 'completed' : 'pending'}`, 'info');
        if (task.completed) {
          globalEventBus.emit(SYSTEM_EVENTS.TASK_COMPLETED, { id });
        }
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchTasks();
      const updated = current.filter(t => t.id !== id);
      saveTasksToMockStorage(updated);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        (old || []).filter(t => t.id !== id)
      );
      
      return { previousTasks };
    },
    onError: (_error, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      addToast('Failed to delete task', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: (id, _, context) => {
      const deletedTask = context?.previousTasks?.find(t => t.id === id);
      addToast('Task deleted', 'info', 4000, {
        label: 'Undo',
        onClick: () => {
          if (deletedTask) {
            undeleteTaskMutation.mutate(deletedTask);
          }
        }
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const current = await fetchTasks();
      const updated = current.map(n => n.id === id ? { ...n, title } : n);
      saveTasksToMockStorage(updated);
      return updated;
    },
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        (old || []).map(t => t.id === id ? { ...t, title } : t)
      );
      
      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      addToast('Failed to update task', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      addToast('Task updated', 'success');
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    addTask: addTaskMutation.mutate,
    toggleTask: toggleTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    isAdding: addTaskMutation.isPending,
  };
}
