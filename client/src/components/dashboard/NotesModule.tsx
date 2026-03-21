import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Plus, Pin, Trash2, Edit3, Check, X } from 'lucide-react'
import { Note } from '../../../../shared/types'

const INITIAL_NOTES: Note[] = [
  { id: '1', title: 'Weekly Sync', content: 'Discussed scaling requirements for primary database.', pinned: true, category: 'Internal', updatedAt: new Date().toISOString() },
  { id: '2', title: 'Client Feedback', content: 'Requested more granular RBAC for enterprise tier.', pinned: false, category: 'Product', updatedAt: new Date().toISOString() },
]

export function NotesModule() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState<{ title: string, content: string }>({ title: '', content: '' })

  const addNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title: 'New Note',
      content: '',
      pinned: false,
      category: 'General',
      updatedAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    startEditing(newNote)
  }

  const togglePin = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditNote({ title: note.title, content: note.content })
  }

  const saveEdit = () => {
    if (!editingId) return
    setNotes(notes.map(n => n.id === editingId ? { ...n, ...editNote, updatedAt: new Date().toISOString() } : n))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const sortedNotes = [...notes].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Quick Notes</CardTitle>
        <Button variant="ghost" size="sm" onClick={addNote} aria-label="Add new note">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-2">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No notes yet. Capture your thoughts!
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div key={note.id} className={`group relative rounded-lg border p-3 transition-colors ${editingId === note.id ? 'border-blue-600 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Input 
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      placeholder="Title"
                      className="h-7 text-sm font-medium bg-zinc-950 border-zinc-800"
                      aria-label="Edit note title input"
                    />
                    <textarea 
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      placeholder="Note content..."
                      className="w-full min-h-[60px] text-xs bg-zinc-950 border border-zinc-800 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-300"
                      aria-label="Edit note content textarea"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300" aria-label="Cancel editing note">
                        <X className="h-4 w-4" />
                      </button>
                      <button onClick={saveEdit} className="text-emerald-500 hover:text-emerald-400" aria-label="Save note changes">
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-zinc-200 truncate cursor-pointer" onClick={() => startEditing(note)}>
                        {note.title}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditing(note)} className="text-zinc-500 hover:text-blue-500" aria-label={`Edit note ${note.title}`}>
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button onClick={() => togglePin(note.id)} className={`${note.pinned ? 'text-blue-500' : 'text-zinc-500'} hover:text-blue-400`} aria-label={note.pinned ? `Unpin note ${note.title}` : `Pin note ${note.title}`}>
                          <Pin className="h-3 w-3" />
                        </button>
                        <button onClick={() => deleteNote(note.id)} className="text-zinc-500 hover:text-red-500" aria-label={`Delete note ${note.title}`}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 cursor-pointer" onClick={() => startEditing(note)}>
                      {note.content || 'Click to edit note...'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded">
                        {note.category}
                      </span>
                      <span className="text-[10px] text-zinc-600">
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
