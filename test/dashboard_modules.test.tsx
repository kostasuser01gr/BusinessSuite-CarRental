import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TasksModule } from '../client/src/components/dashboard/TasksModule'
import { NotesModule } from '../client/src/components/dashboard/NotesModule'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '../client/src/providers/ToastProvider'
import { OnboardingProvider } from '../client/src/providers/OnboardingProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
})

describe('Dashboard Core Modules - Verification Suite', () => {
  beforeEach(() => {
    queryClient.clear()
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('TasksModule', () => {
    it('allows adding, completing, and editing a task', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <OnboardingProvider>
              <TasksModule />
            </OnboardingProvider>
          </ToastProvider>
        </QueryClientProvider>
      )
      
      // Wait for initial load (skeletons gone)
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      }, { timeout: 3000 })

      // 1. Add
      const input = screen.getByPlaceholderText(/Add new task/i)
      const addButton = screen.getByLabelText(/Add task submit/i)
      fireEvent.change(input, { target: { value: 'Verification Task' } })
      fireEvent.click(addButton)
      
      const taskText = await screen.findByText('Verification Task')
      expect(taskText).toBeInTheDocument()

      const taskItem = taskText.closest('[data-testid^="task-item-"]')

      // 2. Edit
      fireEvent.click(taskText) // Enters edit mode
      const editInput = await within(taskItem as HTMLElement).findByLabelText(/Edit task title input/i)
      fireEvent.change(editInput, { target: { value: 'Verified Task' } })
      fireEvent.keyDown(editInput, { key: 'Enter' })
      
      await waitFor(() => {
        expect(screen.getByText('Verified Task')).toBeInTheDocument()
      })

      // 3. Complete
      const completeBtn = within(taskItem as HTMLElement).getByLabelText(/Mark as complete/i)
      fireEvent.click(completeBtn)
      await waitFor(() => {
        expect(screen.getByText('Verified Task')).toHaveClass('line-through')
      })
    })

    it('allows deleting a task', async () => {
      // Set initial data in localStorage since the hook reads from it
      const initialTasks = [{ id: '1', title: 'Review Q4 roadmap', completed: false, priority: 'high', createdAt: new Date().toISOString() }]
      localStorage.setItem('tasks', JSON.stringify(initialTasks))

      render(
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <OnboardingProvider>
              <TasksModule />
            </OnboardingProvider>
          </ToastProvider>
        </QueryClientProvider>
      )

      const taskTitle = await screen.findByText('Review Q4 roadmap')
      expect(taskTitle).toBeInTheDocument()
      
      const deleteBtn = screen.getByLabelText(`Delete task Review Q4 roadmap`)
      fireEvent.click(deleteBtn)
      
      await waitFor(() => {
        expect(screen.queryByText('Review Q4 roadmap')).not.toBeInTheDocument()
      })
    })
  })

  describe('NotesModule', () => {
    it('allows full note lifecycle: add, edit, pin, delete', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <NotesModule />
          </ToastProvider>
        </QueryClientProvider>
      )
      
      // 1. Add
      const addButton = await screen.findByLabelText(/Add new note/i)
      fireEvent.click(addButton)
      
      const titleInput = await screen.findByLabelText(/Edit note title input/i)
      const contentInput = screen.getByLabelText(/Edit note content textarea/i)
      fireEvent.change(titleInput, { target: { value: 'Dev Note' } })
      fireEvent.change(contentInput, { target: { value: 'Ready for deploy' } })
      
      const saveBtn = screen.getByLabelText(/Save note changes/i)
      fireEvent.click(saveBtn)
      
      await waitFor(() => {
        expect(screen.getByText('Dev Note')).toBeInTheDocument()
        expect(screen.getByText('Ready for deploy')).toBeInTheDocument()
      })

      // 2. Pin
      const pinBtn = screen.getByLabelText(/Pin note Dev Note/i)
      fireEvent.click(pinBtn)
      await waitFor(() => {
        expect(pinBtn).toHaveClass('text-primary')
      })

      // 3. Delete
      const deleteBtn = screen.getByLabelText(/Delete note Dev Note/i)
      fireEvent.click(deleteBtn)
      await waitFor(() => {
        expect(screen.queryByText('Dev Note')).not.toBeInTheDocument()
      })
    })
  })
})
