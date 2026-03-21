import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Bot, Send, Sparkles, User as UserIcon, PlusCircle, FileText } from 'lucide-react'
import { useAuth } from '../../providers/AuthProvider'
import { useOperations } from '../../providers/OperationsProvider'
import { cn } from '../../utils/cn'
import { AssistantAction } from '../../../../shared/types'

interface Message {
  role: 'assistant' | 'user'
  content: string
  actions?: AssistantAction[]
}

export function AssistantModule() {
  const { user } = useAuth()
  const { addTask, addNote } = useOperations()
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${user?.name || 'there'}! I'm your AdaptiveAI Assistant. How can I help you optimize your business today?` }
  ])

  const suggestions = [
    "Summarize today's revenue",
    "What are my high priority tasks?",
    "Review last week's notes"
  ]

  const handleAction = (action: AssistantAction) => {
    switch (action.type) {
      case 'create_task':
        addTask(action.payload.title, action.payload.priority)
        setMessages(prev => [...prev, { role: 'assistant', content: `Task "${action.payload.title}" created successfully!` }])
        break
      case 'create_note':
        addNote(action.payload.title, action.payload.content, action.payload.category)
        setMessages(prev => [...prev, { role: 'assistant', content: `Note "${action.payload.title}" added to your workspace.` }])
        break
      default:
        console.log('Action type not implemented:', action.type)
    }
  }

  const handleSend = () => {
    if (!prompt.trim()) return
    const userPrompt = prompt.trim().toLowerCase()
    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }]
    
    // Simple deterministic logic for "Action Layer" demonstration
    const response: Message = { 
      role: 'assistant', 
      content: "I've received your request. Integrating with live business data... (Real-time AI logic pending backend integration)." 
    }

    if (userPrompt.includes('task') || userPrompt.includes('remind')) {
      response.content = "I can help you with that. Would you like me to create a task for you?"
      response.actions = [
        { type: 'create_task', payload: { title: prompt, priority: 'medium' }, label: 'Create Task' }
      ]
    } else if (userPrompt.includes('note') || userPrompt.includes('write')) {
      response.content = "Got it. I can save this as a quick note."
      response.actions = [
        { type: 'create_note', payload: { title: 'Assistant Note', content: prompt, category: 'AI' }, label: 'Create Note' }
      ]
    }

    setMessages([...newMessages, response])
    setPrompt('')
  }

  return (
    <Card className="flex flex-col h-full bg-card border-border overflow-hidden">
      <CardHeader className="pb-2 border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-primary text-sm font-bold">
          <Bot className="h-4 w-4" />
          Assistant Action Layer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-4 bg-background/50">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn("flex gap-3", msg.role === 'user' && "flex-row-reverse")}>
                <div className={cn(
                  "h-8 w-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm",
                  msg.role === 'assistant' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                )}>
                  {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "rounded-2xl p-3 text-sm shadow-sm",
                  msg.role === 'assistant' 
                    ? "bg-card border border-border text-foreground" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {msg.content}
                </div>
              </div>
              
              {msg.actions && (
                <div className="flex flex-wrap gap-2 pl-11">
                  {msg.actions.map((action, ai) => (
                    <Button 
                      key={ai} 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-[10px] gap-1.5 border-primary/30 hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleAction(action)}
                    >
                      {action.type === 'create_task' ? <PlusCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2 border-t border-border mt-auto">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="Ask anything..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-background border-input focus:border-primary h-10 text-sm shadow-inner"
            />
            <Button onClick={handleSend} size="icon" className="h-10 w-10 shrink-0 shadow-md">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
