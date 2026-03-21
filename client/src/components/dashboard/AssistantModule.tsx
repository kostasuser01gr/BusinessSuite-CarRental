import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Bot, Send, Sparkles } from 'lucide-react'

export function AssistantModule() {
  const [prompt, setPrompt] = useState('')

  const suggestions = [
    "Summarize today's revenue",
    "What are my high priority tasks?",
    "Review last week's notes"
  ]

  return (
    <Card className="flex flex-col h-full bg-zinc-900/30 border-blue-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-500">
          <Bot className="h-5 w-5" />
          Adaptive Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="bg-zinc-800/50 rounded-lg p-3 text-sm text-zinc-300 self-start max-w-[85%]">
            Hello! I'm your AdaptiveAI Assistant. How can I help you optimize your business today?
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-[10px] px-2 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 hover:bg-blue-600/20 transition-colors flex items-center gap-1"
              >
                <Sparkles className="h-2 w-2" />
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="Ask anything..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-zinc-950 border-zinc-800 focus:border-blue-600 h-9 text-sm"
            />
            <Button size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
