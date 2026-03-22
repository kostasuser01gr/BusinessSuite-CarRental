import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Activity,
  Bot,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Radar,
  Send,
  Sparkles,
  Terminal,
  User as UserIcon,
  Workflow,
  BookOpenText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../providers/AuthProvider'
import { cn } from '../../utils/cn'
import { AssistantAction } from '../../../../shared/types'
import { CopilotArtifact, CopilotRunResponse } from '../../../../shared/copilot'
import { useTasks } from '../../hooks/useTasks'
import { useNotes } from '../../hooks/useNotes'
import { useAssets } from '../../hooks/useAssets'
import { useToast } from '../../providers/ToastProvider'
import { NeuralLoader } from '../ui/NeuralLoader'
import { PerformanceChart } from '../ui/PerformanceChart'
import { useCopilotRun } from '../../hooks/useCopilot'

type Message =
  | {
      id: string
      role: 'user'
      content: string
    }
  | {
      id: string
      role: 'assistant'
      content: string
      run?: CopilotRunResponse
      actions?: AssistantAction[]
    }

function FleetHealthArtifact({ artifact }: { artifact: Extract<CopilotArtifact, { type: 'fleet_health' }> }) {
  const series = artifact.criticalAssets.length
    ? artifact.criticalAssets.map((asset) => asset.health).sort((a, b) => a - b)
    : [72, 78, 82, 88, 93]

  return (
    <div className="mt-3 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">{artifact.title}</span>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
          AVG {artifact.averageHealth}%
        </span>
      </div>
      <div className="space-y-4 p-4">
        <PerformanceChart data={series} height={64} color="#10b981" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Active Assets</div>
            <div className="mt-1 text-xl font-black">{artifact.activeAssets}</div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">In Maintenance</div>
            <div className="mt-1 text-xl font-black">{artifact.inMaintenance}</div>
          </div>
        </div>
        <div className="space-y-2">
          {artifact.criticalAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs">
              <div>
                <div className="font-semibold text-foreground">{asset.name}</div>
                <div className="text-muted-foreground">{asset.status}</div>
              </div>
              <div className={cn('font-black', asset.health < 60 ? 'text-destructive' : 'text-emerald-600')}>{asset.health}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TaskBacklogArtifact({
  artifact,
  onComplete,
}: {
  artifact: Extract<CopilotArtifact, { type: 'task_backlog' }>
  onComplete: (id: string) => void
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 p-4">
        <ClipboardList className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{artifact.title}</span>
      </div>
      <div className="divide-y divide-border">
        {artifact.tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <div className={cn('text-sm font-semibold', task.completed && 'line-through text-muted-foreground')}>{task.title}</div>
              <div className="text-[11px] text-muted-foreground">
                {task.priority.toUpperCase()}
                {task.dueDate ? ` • Due ${task.dueDate}` : ''}
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0" onClick={() => onComplete(task.id)}>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function OperationalBriefArtifact({ artifact }: { artifact: Extract<CopilotArtifact, { type: 'operational_brief' }> }) {
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{artifact.title}</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-3">
          {artifact.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</div>
              <div
                className={cn(
                  'mt-1 text-xl font-black',
                  metric.tone === 'danger' && 'text-destructive',
                  metric.tone === 'warning' && 'text-amber-600',
                  metric.tone === 'success' && 'text-emerald-600',
                )}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {artifact.alerts.map((alert) => (
            <div key={alert.title} className="rounded-xl border border-border px-3 py-2">
              <div className="text-xs font-semibold text-foreground">{alert.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{alert.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AutomationPlanArtifact({ artifact }: { artifact: Extract<CopilotArtifact, { type: 'automation_plan' }> }) {
  return (
    <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-primary/10 p-4 text-primary">
        <Workflow className="h-4 w-4" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{artifact.title}</span>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Trigger</div>
          <div className="mt-1 text-sm font-medium">{artifact.trigger}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Action Chain</div>
          <div className="mt-2 space-y-2">
            {artifact.actions.map((step) => (
              <div key={step} className="rounded-xl border border-primary/10 bg-background px-3 py-2 text-xs">
                {step}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Safeguards</div>
          <div className="mt-2 space-y-2">
            {artifact.safeguards.map((guard) => (
              <div key={guard} className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                {guard}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function KnowledgeDigestArtifact({ artifact }: { artifact: Extract<CopilotArtifact, { type: 'knowledge_digest' }> }) {
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <BookOpenText className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{artifact.title}</span>
      </div>
      <div className="space-y-3 p-4">
        {artifact.highlights.map((highlight) => (
          <div key={highlight} className="rounded-xl border border-border px-3 py-2 text-xs text-foreground">
            {highlight}
          </div>
        ))}
        {artifact.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artifact.sources.map((source) => (
              <span key={source} className="rounded-full border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ArtifactRenderer({
  artifact,
  onCompleteTask,
}: {
  artifact: CopilotArtifact
  onCompleteTask: (id: string) => void
}) {
  switch (artifact.type) {
    case 'fleet_health':
      return <FleetHealthArtifact artifact={artifact} />
    case 'task_backlog':
      return <TaskBacklogArtifact artifact={artifact} onComplete={onCompleteTask} />
    case 'operational_brief':
      return <OperationalBriefArtifact artifact={artifact} />
    case 'automation_plan':
      return <AutomationPlanArtifact artifact={artifact} />
    case 'knowledge_digest':
      return <KnowledgeDigestArtifact artifact={artifact} />
    default:
      return null
  }
}

export function AssistantModule() {
  const { user } = useAuth()
  const location = useLocation()
  const { tasks, addTask, toggleTask } = useTasks()
  const { notes, addNote } = useNotes()
  const { assets } = useAssets()
  const { addToast } = useToast()
  const copilotRun = useCopilotRun()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name || 'Operator'}. Copilot runtime is online with planning, execution state, and artifact rendering. Ask for an operational brief, backlog triage, fleet analysis, or an automation draft.`,
    },
  ])

  const latestRun = useMemo(
    () => [...messages].reverse().find((message): message is Extract<Message, { role: 'assistant'; run?: CopilotRunResponse }> => message.role === 'assistant' && Boolean(message.run))?.run,
    [messages],
  )

  const suggestions = latestRun?.suggestedPrompts ?? [
    'Give me an operational briefing',
    'Show my highest priority backlog',
    'Draft a maintenance automation',
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, copilotRun.isPending])

  const runAction = (action: AssistantAction) => {
    switch (action.type) {
      case 'create_task':
        addTask(action.payload.title)
        addToast(`Copilot created task: ${action.payload.title}`, 'success')
        return `Task created: ${action.payload.title}`
      case 'create_note':
        addNote(action.payload)
        addToast(`Copilot saved note: ${action.payload.title}`, 'success')
        return `Note saved: ${action.payload.title}`
      case 'create_automation':
        addToast(`Automation staged: ${action.payload.name}`, 'success')
        return `Automation staged: ${action.payload.name}`
      case 'schedule_maintenance':
        addTask(`Schedule maintenance for ${action.payload.assetName}`)
        addToast(`Maintenance task created for ${action.payload.assetName}`, 'success')
        return `Maintenance scheduled for ${action.payload.assetName}`
      case 'open_module':
        addToast(`Open module: ${action.payload.module}`, 'info')
        return `Requested module: ${action.payload.module}`
      default:
        return 'Action completed.'
    }
  }

  const submitPrompt = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || copilotRun.isPending) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setPrompt('')

    try {
      const run = await copilotRun.mutateAsync({
        prompt: trimmed,
        context: {
          userName: user?.name,
          page: location.pathname,
          tasks: tasks.map((task) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: task.priority,
            dueDate: task.dueDate,
          })),
          notes: notes.map((note) => ({
            id: note.id,
            title: note.title,
            category: note.category,
            pinned: note.pinned,
            updatedAt: note.updatedAt,
          })),
          assets: assets.map((asset) => ({
            id: asset.id,
            name: asset.name,
            type: asset.type,
            status: asset.status,
            health: asset.health,
            location: asset.location,
          })),
        },
      })

      setMessages((current) => [
        ...current,
        {
          id: run.id,
          role: 'assistant',
          content: run.summary,
          run,
          actions: run.actions,
        },
      ])
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: error.message || 'Copilot could not complete this run.',
        },
      ])
      addToast(error.message || 'Copilot run failed', 'error')
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border bg-card shadow-2xl" data-testid="assistant-module">
      <CardHeader className="border-b border-border bg-primary/5 pb-3">
        <CardTitle className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-primary">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground shadow-lg shadow-primary/20">
              <Bot className="h-4 w-4" />
            </div>
            <span>Adaptive Copilot Runtime</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-[9px] font-bold text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plan + Act + Verify
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden bg-gradient-to-b from-background to-muted/10 pt-6">
        <div ref={scrollRef} className="custom-scrollbar flex-1 space-y-8 overflow-y-auto pr-2" data-testid="assistant-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex max-w-[96%] flex-col gap-2',
                message.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
              )}
            >
              <div className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}>
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-xl',
                    message.role === 'assistant'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground',
                  )}
                >
                  {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className="w-full">
                  <div
                    className={cn(
                      'rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm',
                      message.role === 'assistant'
                        ? 'rounded-tl-none border border-border bg-card text-foreground'
                        : 'rounded-tr-none bg-primary font-medium text-primary-foreground',
                    )}
                  >
                    {message.content}
                  </div>

                  {message.role === 'assistant' && message.run && (
                    <div className="mt-3 space-y-3">
                      <div className="rounded-2xl border border-border bg-background/70 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">{message.run.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {message.run.mode} mode
                              {' • '}
                              {message.run.status === 'awaiting_approval' ? 'Awaiting approval' : 'Completed'}
                            </div>
                          </div>
                          <div
                            className={cn(
                              'rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em]',
                              message.run.status === 'awaiting_approval'
                                ? 'bg-amber-500/10 text-amber-700'
                                : 'bg-emerald-500/10 text-emerald-700',
                            )}
                          >
                            {message.run.status === 'awaiting_approval' ? 'Approval' : 'Ready'}
                          </div>
                        </div>
                        <ol className="space-y-2">
                          {message.run.steps.map((step, index) => (
                            <li key={step.id} className="flex gap-3 rounded-xl border border-border px-3 py-2">
                              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-black text-muted-foreground">
                                {index + 1}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-foreground">{step.title}</span>
                                  <span
                                    className={cn(
                                      'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]',
                                      step.status === 'completed' && 'bg-emerald-500/10 text-emerald-700',
                                      step.status === 'awaiting_approval' && 'bg-amber-500/10 text-amber-700',
                                    )}
                                  >
                                    {step.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="mt-1 text-[11px] text-muted-foreground">{step.detail}</div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {message.run.artifacts.map((artifact) => (
                        <ArtifactRenderer key={`${message.id}_${artifact.type}`} artifact={artifact} onCompleteTask={toggleTask} />
                      ))}

                      {message.actions && message.actions.length > 0 && (
                        <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-4">
                          <div className="mb-3 flex items-center gap-2 text-primary">
                            <Terminal className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.22em]">Execution Actions</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.actions.map((action) => (
                              <Button
                                key={action.label}
                                size="sm"
                                className="h-8 gap-2 px-4 text-[10px] font-black uppercase tracking-[0.16em]"
                                onClick={() => {
                                  const result = runAction(action)
                                  setMessages((current) => [
                                    ...current,
                                    {
                                      id: `action_${Date.now()}_${action.label}`,
                                      role: 'assistant',
                                      content: result,
                                    },
                                  ])
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {copilotRun.isPending && (
            <div className="ml-1 mr-auto flex flex-col gap-4 items-start">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary bg-primary text-primary-foreground shadow-2xl">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="space-y-1 rounded-2xl rounded-tl-none border border-border bg-card p-3 shadow-sm">
                  <div className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary">
                    <Sparkles className="h-3 w-3" />
                    Building execution plan...
                  </div>
                  <NeuralLoader className="h-6 w-16 text-primary/60" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-4 border-t border-border pt-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[10px] font-bold text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Sparkles className="h-3 w-3 text-primary/60" />
                {suggestion}
              </button>
            ))}
          </div>

          <div className="relative flex gap-2">
            <Input
              placeholder="Ask Copilot to brief, plan, analyze, or draft..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void submitPrompt(prompt)
                }
              }}
              className="h-12 rounded-xl border-border bg-background px-4 pr-12 text-sm shadow-inner transition-all focus:border-primary"
              disabled={copilotRun.isPending}
            />
            <Button
              onClick={() => void submitPrompt(prompt)}
              size="icon"
              className="absolute right-1.5 top-1.5 h-9 w-9 shrink-0 rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
              disabled={copilotRun.isPending || !prompt.trim()}
            >
              {copilotRun.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
