import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Bot, Send, Sparkles, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../providers/AuthProvider'
import { cn } from '../../utils/cn'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

export function AssistantModule() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${user?.name || 'there'}! I'm your AdaptiveAI Assistant. How can I help you optimize your business today?` }
  ])

  const suggestions = [
    "Summarize today's revenue",
    "What are my high priority tasks?",
    "Review last week's notes"
  ]

  const handleSend = () => {
    if (!prompt.trim()) return
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: prompt },
      { role: 'assistant', content: "I've received your request. Integrating with live business data... (Real-time AI logic pending backend integration)." }
    ]
    setMessages(newMessages)
    setPrompt('')
  }

  return (
    <Card className="flex flex-col h-full bg-card border-border overflow-hidden">
      <CardHeader className="pb-2 border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bot className="h-5 w-5" />
          Adaptive Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-4 bg-background/50">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
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
