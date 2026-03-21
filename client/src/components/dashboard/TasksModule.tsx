import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { CheckCircle2, Clock, Plus, Trash2, Edit2, Check } from 'lucide-react'
import { Task } from '../../../../shared/types'

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Review Q4 roadmap', completed: false, priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Approve new hires', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: '3', title: 'Update privacy policy', completed: true, priority: 'low', createdAt: new Date().toISOString() },
]

export function TasksModule() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString()
    }
    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = () => {
    if (!editingId) return
    setTasks(tasks.map(t => t.id === editingId ? { ...t, title: editTitle } : t))
    setEditingId(null)
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTask} className="flex gap-2 mb-4 mt-2">
          <Input 
            placeholder="Add new task..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="bg-zinc-950 border-zinc-800"
          />
          <Button type="submit" size="icon" variant="outline" aria-label="Add task submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No tasks found. Relax or add some!
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 group" data-testid={`task-item-${task.id}`}>
                <button 
                  onClick={() => toggleTask(task.id)} 
                  className="shrink-0"
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-zinc-500 hover:text-blue-500 transition-colors" />
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
                        className="h-7 text-sm py-0 bg-zinc-950 border-blue-600"
                        aria-label="Edit task title input"
                      />
                      <button onClick={saveEdit} className="text-emerald-500" aria-label="Save task title">
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p 
                      className={`text-sm font-medium truncate cursor-pointer ${task.completed ? "text-zinc-500 line-through" : "text-zinc-200"}`}
                      onClick={() => startEditing(task)}
                    >
                      {task.title}
                    </p>
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
                        onClick={() => startEditing(task)}
                        className="text-zinc-500 hover:text-blue-500"
                        aria-label={`Edit task ${task.title}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-zinc-500 hover:text-red-500"
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
