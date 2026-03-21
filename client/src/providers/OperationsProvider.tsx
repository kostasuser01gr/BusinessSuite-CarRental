import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Note } from '../../../shared/types';

interface OperationsContextType {
  tasks: Task[];
  addTask: (title: string, priority?: Task['priority']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  
  notes: Note[];
  addNote: (title: string, content: string, category?: string) => void;
  togglePin: (id: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review Q4 roadmap', completed: false, priority: 'high', createdAt: new Date().toISOString(), dueDate: '2026-03-25' },
    { id: '2', title: 'Approve new hires', completed: false, priority: 'medium', createdAt: new Date().toISOString(), dueDate: '2026-03-22' },
    { id: '3', title: 'Update privacy policy', completed: true, priority: 'low', createdAt: new Date().toISOString() },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Weekly Sync', content: 'Discussed scaling requirements for primary database.', pinned: true, category: 'Internal', updatedAt: new Date().toISOString() },
    { id: '2', title: 'Client Feedback', content: 'Requested more granular RBAC for enterprise tier.', pinned: false, category: 'Product', updatedAt: new Date().toISOString() },
  ]);

  const addTask = (title: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, title: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const addNote = (title: string, content: string, category: string = 'General') => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title,
      content,
      pinned: false,
      category,
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
  };

  return (
    <OperationsContext.Provider value={{ 
      tasks, addTask, toggleTask, deleteTask, updateTask,
      notes, addNote, togglePin, deleteNote, updateNote
    }}>
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (context === undefined) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
}
