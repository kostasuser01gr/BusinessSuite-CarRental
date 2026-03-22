import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { CheckCircle2, Clock, Plus, Trash2, Edit2, Check, Calendar } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Task } from '../../../../shared/types'
import { animateStaggeredReveal, animatePulse } from '../../animations'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskInput } from '../../../../shared/schemas'
import { useTasks } from '../../hooks/useTasks'
import { Skeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { useOnboarding } from '../../providers/OnboardingProvider'

export function TasksModule() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask, isLoading, isAdding } = useTasks()
  const { isActive, step, isWaitingForAction, nextStep } = useOnboarding()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  })

  useEffect(() => {
    if (listRef.current && tasks.length > 0 && !isLoading) {
      const items = listRef.current.querySelectorAll('.task-item-animate')
      animateStaggeredReveal(items, 30)
    }
  }, [tasks.length, isLoading])

  const onAddTask = (data: TaskInput) => {
    addTask(data.title)
    reset()
    
    // If onboarding is active and waiting for a task to be added
    if (isActive && isWaitingForAction && step === 4) {
      nextStep()
    }
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = () => {
    if (!editingId) return
    if (editTitle.trim()) {
      updateTask({ id: editingId, title: editTitle })
    }
    setEditingId(null)
  }

  return (
    <Card className="h-full" data-testid="tasks-module" data-tour="tasks-module">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onAddTask)} className="flex flex-col gap-1 mb-4 mt-2">
          <div className="flex gap-2">
            <Input 
              placeholder="Add new task..." 
              className={cn("bg-background border-input", errors.title && "border-destructive")}
              {...register('title')}
              disabled={isAdding}
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="outline" 
              aria-label="Add task submit"
              onClick={(e) => animatePulse(e.currentTarget)}
              disabled={isAdding}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
        </form>

        <div className="space-y-3" ref={listRef}>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState 
              title="All caught up!"
              description="You have no pending tasks. Enjoy your productivity or add a new goal above."
              illustration="empty-tasks"
              className="py-12"
            />
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="task-item-animate flex items-center gap-3 group opacity-0" 
                data-testid={`task-item-${task.id}`}
              >
                <button 
                  onClick={(e) => {
                    animatePulse(e.currentTarget);
                    toggleTask(task.id);
                  }} 
                  className="shrink-0"
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  {editingId === task.id ? (
                    <div className="flex gap-1">
                      <Input 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="h-7 text-sm py-0 bg-background border-primary"
                        aria-label="Edit task title input"
                      />
                      <button onClick={(e) => { animatePulse(e.currentTarget); saveEdit(); }} className="text-emerald-500" aria-label="Save task title">
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p 
                        className={cn(
                          "text-sm font-medium truncate cursor-pointer transition-colors",
                          task.completed ? "text-muted-foreground line-through" : "text-foreground hover:text-primary"
                        )}
                        onClick={() => startEditing(task)}
                      >
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingId !== task.id && (
                  <>
                    <Badge 
                      variant={task.completed ? "success" : task.priority === "high" ? "destructive" : task.priority === "medium" ? "secondary" : "outline"}
                      className="hidden sm:inline-flex"
                    >
                      {task.priority}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { animatePulse(e.currentTarget); startEditing(task); }}
                        className="text-muted-foreground hover:text-primary"
                        aria-label={`Edit task ${task.title}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => { animatePulse(e.currentTarget); deleteTask(task.id); }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete task ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
