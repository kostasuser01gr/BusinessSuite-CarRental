import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Plus, Pin, Trash2, Edit3, Check, X, Tag } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Note } from '../../../../shared/types'
import { useNotes } from '../../hooks/useNotes'
import { animateStaggeredReveal, animatePulse } from '../../animations'
import { Skeleton } from '../ui/Skeleton'

export function NotesModule() {
  const { notes, addNote, togglePin, deleteNote, updateNote, isLoading } = useNotes()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState<{ title: string, content: string, category: string }>({ title: '', content: '', category: '' })
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current && notes.length > 0 && !isLoading) {
      const items = listRef.current.querySelectorAll('.note-item-animate')
      animateStaggeredReveal(items, 40)
    }
  }, [notes.length, isLoading])

  const handleAddNote = () => {
    addNote({ title: 'New Note', content: '', category: 'General' })
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditNote({ title: note.title, content: note.content, category: note.category })
  }

  const saveEdit = () => {
    if (!editingId) return
    updateNote({ id: editingId, title: editNote.title, content: editNote.content })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const sortedNotes = [...notes].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))

  return (
    <Card className="h-full" data-testid="notes-module">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Quick Notes</CardTitle>
        <Button variant="ghost" size="sm" onClick={(e) => { animatePulse(e.currentTarget); handleAddNote(); }} aria-label="Add new note">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-2" ref={listRef}>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No notes yet. Capture your thoughts!
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div 
                key={note.id} 
                className={cn(
                  "note-item-animate group relative rounded-lg border p-3 transition-all duration-200 opacity-0",
                  editingId === note.id 
                    ? "border-primary bg-background shadow-md" 
                    : "border-border bg-card hover:border-muted-foreground/50"
                )}
              >
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Input 
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      placeholder="Title"
                      className="h-8 text-sm font-medium bg-background border-input"
                      aria-label="Edit note title input"
                    />
                    <textarea 
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      placeholder="Note content..."
                      className="w-full min-h-[80px] text-xs bg-background border border-input rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      aria-label="Edit note content textarea"
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                        <Input 
                          value={editNote.category}
                          onChange={(e) => setEditNote({ ...editNote, category: e.target.value })}
                          placeholder="Category"
                          className="h-7 pl-7 text-[10px] bg-background border-input"
                        />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={cancelEdit} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Cancel editing note">
                          <X className="h-4 w-4" />
                        </button>
                        <button onClick={(e) => { animatePulse(e.currentTarget); saveEdit(); }} className="p-1 text-emerald-500 hover:text-emerald-400" aria-label="Save note changes">
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start gap-2">
                      <h4 
                        className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors" 
                        onClick={() => startEditing(note)}
                      >
                        {note.title}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { animatePulse(e.currentTarget); togglePin(note.id); }} 
                          className={cn(
                            "p-1 transition-colors",
                            note.pinned ? "text-primary" : "text-muted-foreground hover:text-primary"
                          )} 
                          aria-label={note.pinned ? `Unpin note ${note.title}` : `Pin note ${note.title}`}
                        >
                          <Pin className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={(e) => { animatePulse(e.currentTarget); startEditing(note); }} 
                          className="p-1 text-muted-foreground hover:text-primary"
                          aria-label={`Edit note ${note.title}`}
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={(e) => { animatePulse(e.currentTarget); deleteNote(note.id); }} 
                          className="p-1 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete note ${note.title}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p 
                      className="text-xs text-muted-foreground mt-1 line-clamp-2 cursor-pointer" 
                      onClick={() => startEditing(note)}
                    >
                      {note.content || 'Click to edit note...'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {note.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
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
