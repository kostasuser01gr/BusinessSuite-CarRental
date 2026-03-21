import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TasksModule } from '../client/src/components/dashboard/TasksModule'
import { NotesModule } from '../client/src/components/dashboard/NotesModule'
import { OperationsProvider } from '../client/src/providers/OperationsProvider'

describe('Dashboard Core Modules - Verification Suite', () => {
  describe('TasksModule', () => {
    it('allows adding, completing, and editing a task', () => {
      render(
        <OperationsProvider>
          <TasksModule />
        </OperationsProvider>
      )
      
      // 1. Add
      const input = screen.getByPlaceholderText(/Add new task/i)
      const addButton = screen.getByLabelText(/Add task submit/i)
      fireEvent.change(input, { target: { value: 'Verification Task' } })
      fireEvent.click(addButton)
      
      const taskText = screen.getByText('Verification Task')
      expect(taskText).toBeInTheDocument()
      const taskItem = taskText.closest('[data-testid^="task-item-"]')

      // 2. Edit
      fireEvent.click(taskText) // Enters edit mode
      const editInput = within(taskItem as HTMLElement).getByLabelText(/Edit task title input/i)
      fireEvent.change(editInput, { target: { value: 'Verified Task' } })
      const saveBtn = within(taskItem as HTMLElement).getByLabelText(/Save task title/i)
      fireEvent.click(saveBtn)
      expect(screen.getByText('Verified Task')).toBeInTheDocument()

      // 3. Complete
      const completeBtn = within(taskItem as HTMLElement).getByLabelText(/Mark as complete/i)
      fireEvent.click(completeBtn)
      expect(screen.getByText('Verified Task')).toHaveClass('line-through')
    })

    it('allows deleting a task', () => {
      render(
        <OperationsProvider>
          <TasksModule />
        </OperationsProvider>
      )
      const taskTitle = 'Review Q4 roadmap'
      expect(screen.getByText(taskTitle)).toBeInTheDocument()
      
      const deleteBtn = screen.getByLabelText(`Delete task ${taskTitle}`)
      fireEvent.click(deleteBtn)
      expect(screen.queryByText(taskTitle)).not.toBeInTheDocument()
    })
  })

  describe('NotesModule', () => {
    it('allows full note lifecycle: add, edit, pin, delete', () => {
      render(
        <OperationsProvider>
          <NotesModule />
        </OperationsProvider>
      )
      
      // 1. Add
      const addButton = screen.getByLabelText(/Add new note/i)
      fireEvent.click(addButton)
      
      // Click edit on the newly added note
      const editBtn = screen.getByLabelText(/Edit note New Note/i)
      fireEvent.click(editBtn)

      const titleInput = screen.getByLabelText(/Edit note title input/i)
      const contentInput = screen.getByLabelText(/Edit note content textarea/i)
      fireEvent.change(titleInput, { target: { value: 'Dev Note' } })
      fireEvent.change(contentInput, { target: { value: 'Ready for deploy' } })
      
      const saveBtn = screen.getByLabelText(/Save note changes/i)
      fireEvent.click(saveBtn)
      
      expect(screen.getByText('Dev Note')).toBeInTheDocument()
      expect(screen.getByText('Ready for deploy')).toBeInTheDocument()

      // 2. Pin
      const pinBtn = screen.getByLabelText(/Pin note Dev Note/i)
      fireEvent.click(pinBtn)
      // Visual check for pin state (text-primary class)
      expect(pinBtn).toHaveClass('text-primary')

      // 3. Delete
      const deleteBtn = screen.getByLabelText(/Delete note Dev Note/i)
      fireEvent.click(deleteBtn)
      expect(screen.queryByText('Dev Note')).not.toBeInTheDocument()
    })
  })
})
