import { useState, useEffect, useRef } from "react"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { 
  Zap, 
  Settings as SettingsIcon, 
  Plus, 
  Clock, 
  ArrowRight,
  Database,
  Mail,
  Bell,
  Activity,
  Bot,
  Play,
  Pause,
  BrainCircuit,
  Workflow as WorkflowIcon,
  Sparkles,
  ShieldAlert,
  Lock
} from "lucide-react"
import { animate } from "animejs"
import { cn } from "../utils/cn"
import { useToast } from "../providers/ToastProvider"
import { Badge } from "../components/ui/Badge"
import { useAuth } from "../providers/AuthProvider"
import { hasPermission } from "../lib/permissions"
import { VisualWorkflowBuilder } from "../components/dashboard/VisualWorkflowBuilder"

interface Workflow {
  id: string
  name: string
  trigger: string
  actionCount: number
  status: 'active' | 'paused'
  lastRun: string
  description: string
}

const INITIAL_WORKFLOWS: Workflow[] = [
  { 
    id: 'WF-001', 
    name: 'Critical Asset Recovery', 
    trigger: 'Asset Health < 40%', 
    actionCount: 3, 
    status: 'active', 
    lastRun: '2 hours ago',
    description: 'Auto-generates a high-priority maintenance task and notifies the floor supervisor via Slack.'
  },
  { 
    id: 'WF-002', 
    name: 'Smart Booking Dispatch', 
    trigger: 'New Booking Created', 
    actionCount: 2, 
    status: 'active', 
    lastRun: '15 mins ago',
    description: 'Finds the nearest available delivery van and drafts an optimized route for the driver.'
  },
  { 
    id: 'WF-003', 
    name: 'Executive Fleet Report', 
    trigger: 'Schedule: Every Monday 8AM', 
    actionCount: 1, 
    status: 'paused', 
    lastRun: '4 days ago',
    description: 'Aggregates utilization and health data into a PDF and emails it to stakeholders.'
  },
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [showBuilder, setShowBuilder] = useState(false)
  const { addToast } = useToast()
  const { user } = useAuth()
  const listRef = useRef<HTMLDivElement>(null)

  const canManage = hasPermission(user, 'AUTOMATION', 'MANAGE')

  useEffect(() => {
    if (listRef.current && !showBuilder) {
      animate(listRef.current.querySelectorAll('.workflow-card'), {
        translateY: [20, 0],
        opacity: [0, 1],
        delay: (el: any, i: number) => i * 100,
        duration: 600,
        easing: 'easeOutCubic'
      })
    }
  }, [showBuilder])

  const toggleStatus = (id: string) => {
    if (!canManage) {
      addToast("Insufficient permissions to toggle workflows", "error")
      return
    }
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === id) {
        const newStatus = wf.status === 'active' ? 'paused' : 'active'
        addToast(`Workflow ${newStatus === 'active' ? 'resumed' : 'paused'}`, 'info')
        return { ...wf, status: newStatus }
      }
      return wf
    }))
  }

  if (!hasPermission(user, 'AUTOMATION', 'READ')) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your current role ({user?.role}) does not have permission to access the Automation Engine. 
            Please contact your system administrator.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <>
      <div className={cn("flex flex-col gap-6 animate-in fade-in duration-500", showBuilder && "hidden")}>
        <SectionHeader
          title="Automation Engine"
          description="Design and manage autonomous business workflows powered by AdaptiveAI."
          action={
            canManage && (
              <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setShowBuilder(true)}>
                <Plus className="h-4 w-4" /> New Workflow
              </Button>
            )
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div ref={listRef} className="grid gap-4">
              {workflows.map((wf) => (
                <Card key={wf.id} className="workflow-card opacity-0 group border-border bg-card hover:border-primary/30 transition-all overflow-hidden shadow-sm cursor-pointer" onClick={() => setShowBuilder(true)}>
                  <CardContent className="p-0">
                    <div className="flex items-stretch min-h-[120px]">
                      <div className={cn(
                        "w-1.5 transition-colors duration-500",
                        wf.status === 'active' ? "bg-primary" : "bg-muted"
                      )} />
                      <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl transition-colors",
                            wf.status === 'active' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            <Zap className={cn("h-6 w-6", wf.status === 'active' && "fill-primary/20")} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-foreground">{wf.name}</h4>
                              <Badge variant={wf.status === 'active' ? 'success' : 'outline'} className="text-[9px] h-4">
                                {wf.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">{wf.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 flex items-center gap-1">
                                <WorkflowIcon className="h-3 w-3" /> {wf.trigger}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Last run: {wf.lastRun}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 self-end sm:self-center border-t sm:border-t-0 pt-4 sm:pt-0" onClick={e => e.stopPropagation()}>
                          <div className="text-right hidden xl:block mr-4">
                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Steps</p>
                            <p className="text-sm font-black">{wf.actionCount}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg"
                            onClick={() => toggleStatus(wf.id)}
                            disabled={!canManage}
                          >
                            {wf.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                            disabled={!canManage}
                          >
                            <SettingsIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {canManage ? (
              <Card className="border-dashed border-2 border-border bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group p-12" onClick={() => setShowBuilder(true)}>
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Add Automation Step</h3>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed text-balance">
                      Chain multi-resource triggers from Assets, Bookings, or Tasks to external APIs and webhooks.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 border-primary/20 text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Open Visual Canvas
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="bg-muted/30 border border-border p-8 rounded-2xl flex items-center gap-4 text-muted-foreground italic text-sm">
                <ShieldAlert className="h-5 w-5" />
                <span>Standard users cannot create new workflows. Contact your supervisor for access.</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5 shadow-lg shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="h-12 w-12 text-primary/10 rotate-12" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <Bot className="h-4 w-4" />
                  AI Agent Suggestion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  I've identified a pattern: <strong>85%</strong> of "HVAC" bookings results in a manual follow-up task being created 48 hours later. 
                  <br/><br/>
                  Should I create a <strong>"Post-Service Quality Check"</strong> workflow for you?
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20" disabled={!canManage} onClick={() => setShowBuilder(true)}>
                    Deploy Automation
                  </Button>
                  <Button variant="ghost" className="w-full text-[10px] font-bold uppercase text-muted-foreground">
                    View Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ecosystem Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Stripe', icon: Database, color: 'text-blue-500' },
                    { name: 'Slack', icon: Bell, color: 'text-purple-500' },
                    { name: 'G-Mail', icon: Mail, color: 'text-red-500' },
                    { name: 'Twilio', icon: Activity, color: 'text-orange-500' },
                    { name: 'Salesforce', icon: Database, color: 'text-sky-500' },
                    { name: 'HTTP/JSON', icon: Zap, color: 'text-amber-500' },
                  ].map((integ) => (
                    <div key={integ.name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/20 hover:bg-background transition-all cursor-pointer group shadow-sm hover:shadow-md">
                      <integ.icon className={cn("h-5 w-5 opacity-60 group-hover:opacity-100 transition-all", integ.color)} />
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{integ.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4 border-t border-border mt-2">
                <Button variant="ghost" className="w-full h-8 text-[10px] font-bold gap-2 text-primary">
                  View all 42 integrations <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xs font-bold">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Live Execution Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: '14:22:01', event: 'WF-002: SUCCESS', details: 'Route sent to Van #12' },
                  { time: '13:05:44', event: 'WF-001: TRIGGERED', details: 'AST-003 Health: 38%' },
                  { time: '09:00:00', event: 'WF-003: SKIPPED', details: 'Workflow is paused' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 text-[10px] font-medium leading-tight border-l-2 border-border pl-3 ml-1 hover:border-primary transition-colors">
                    <span className="text-muted-foreground font-mono shrink-0">{log.time}</span>
                    <div className="flex flex-col">
                      <span className="text-foreground">{log.event}</span>
                      <span className="text-muted-foreground opacity-70">{log.details}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {showBuilder && <VisualWorkflowBuilder onClose={() => setShowBuilder(false)} />}
    </>
  )
}
