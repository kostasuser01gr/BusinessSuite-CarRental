import { Router } from 'express'
import {
  copilotRunRequestSchema,
} from '../../shared/copilot.js'
import type { CopilotArtifact, CopilotRunResponse } from '../../shared/copilot.js'

const router = Router()

router.post('/run', (req, res) => {
  try {
    const { prompt, context } = copilotRunRequestSchema.parse(req.body)
    const normalizedPrompt = prompt.toLowerCase()
    const pendingTasks = context.tasks.filter((task) => !task.completed)
    const overdueTasks = pendingTasks.filter((task) => task.dueDate && new Date(task.dueDate).getTime() < Date.now())
    const maintenanceAssets = context.assets.filter((asset) => asset.status === 'maintenance')
    const criticalAssets = [...context.assets].sort((a, b) => a.health - b.health).slice(0, 3)
    const pinnedNotes = context.notes.filter((note) => note.pinned).slice(0, 3)

    let mode: CopilotRunResponse['mode'] = 'analysis'
    let status: CopilotRunResponse['status'] = 'completed'
    let title = 'Operational Analysis'
    let summary = `I reviewed ${pendingTasks.length} active tasks, ${context.assets.length} assets, and ${context.notes.length} knowledge notes to answer "${prompt}".`
    let artifacts: CopilotArtifact[] = []
    let actions: CopilotRunResponse['actions'] = []
    let suggestedPrompts = [
      'Create a priority task from this plan',
      'Summarize operational risk for leadership',
      'Draft an automation from today’s bottlenecks',
    ]

    if (
      normalizedPrompt.includes('brief') ||
      normalizedPrompt.includes('overview') ||
      normalizedPrompt.includes('morning') ||
      normalizedPrompt.includes('summary')
    ) {
      mode = 'briefing'
      title = 'Operational Briefing'
      summary = `Here is the current operational briefing for ${context.userName || req.user?.name || 'your team'}: ${pendingTasks.length} active tasks, ${maintenanceAssets.length} assets in maintenance, and ${pinnedNotes.length} pinned notes worth surfacing.`
      artifacts = [
        {
          type: 'operational_brief',
          title: 'Today at a glance',
          metrics: [
            { label: 'Active tasks', value: String(pendingTasks.length), tone: pendingTasks.length > 5 ? 'warning' : 'default' },
            { label: 'Overdue work', value: String(overdueTasks.length), tone: overdueTasks.length > 0 ? 'danger' : 'success' },
            { label: 'Assets in maintenance', value: String(maintenanceAssets.length), tone: maintenanceAssets.length > 0 ? 'warning' : 'success' },
          ],
          alerts: [
            ...(overdueTasks[0]
              ? [{ title: `Overdue: ${overdueTasks[0].title}`, detail: 'Promote this task into today’s operating queue.', severity: 'critical' as const }]
              : []),
            ...(criticalAssets[0]
              ? [{ title: `Low health: ${criticalAssets[0].name}`, detail: `${criticalAssets[0].health}% health and currently ${criticalAssets[0].status}.`, severity: 'warning' as const }]
              : []),
            ...(pinnedNotes[0]
              ? [{ title: `Pinned note: ${pinnedNotes[0].title}`, detail: `Category: ${pinnedNotes[0].category}. Last updated ${new Date(pinnedNotes[0].updatedAt).toLocaleDateString()}.`, severity: 'info' as const }]
              : []),
          ],
        },
      ]
    } else if (
      normalizedPrompt.includes('fleet') ||
      normalizedPrompt.includes('asset') ||
      normalizedPrompt.includes('health') ||
      normalizedPrompt.includes('maintenance')
    ) {
      mode = 'analysis'
      title = 'Fleet Health Review'
      summary = `I analyzed asset health and maintenance exposure. ${maintenanceAssets.length} assets are already in maintenance and the lowest-health asset is ${criticalAssets[0]?.name || 'currently unavailable'}.`
      artifacts = [
        {
          type: 'fleet_health',
          title: 'Fleet health analysis',
          averageHealth:
            context.assets.length > 0
              ? Math.round(context.assets.reduce((total, asset) => total + asset.health, 0) / context.assets.length)
              : 0,
          inMaintenance: maintenanceAssets.length,
          activeAssets: context.assets.filter((asset) => asset.status === 'available' || asset.status === 'in-use').length,
          criticalAssets: criticalAssets.map((asset) => ({
            id: asset.id,
            name: asset.name,
            health: asset.health,
            status: asset.status,
          })),
        },
      ]
      suggestedPrompts = [
        'Create a maintenance task for the weakest asset',
        'Draft a predictive maintenance workflow',
        'Show the operational briefing again',
      ]
    } else if (
      normalizedPrompt.includes('task') ||
      normalizedPrompt.includes('backlog') ||
      normalizedPrompt.includes('todo') ||
      normalizedPrompt.includes('pending')
    ) {
      mode = 'execution'
      title = 'Backlog Triage'
      const focusedTasks = pendingTasks
        .sort((a, b) => {
          const priorityScore = { high: 3, medium: 2, low: 1 }
          return priorityScore[b.priority] - priorityScore[a.priority]
        })
        .slice(0, 5)

      summary = focusedTasks.length
        ? `I ranked the backlog by urgency. The highest-leverage next task is "${focusedTasks[0].title}"${focusedTasks[0].dueDate ? ` due ${focusedTasks[0].dueDate}` : ''}.`
        : 'There are no pending tasks right now. I would convert an operational risk into a new task to keep momentum.'

      artifacts = [
        {
          type: 'task_backlog',
          title: 'Priority queue',
          tasks: focusedTasks,
        },
      ]

      if (!focusedTasks.length || normalizedPrompt.includes('create')) {
        actions = [
          {
            type: 'create_task',
            label: 'Create executive follow-up task',
            payload: {
              title: 'Review operational bottlenecks and assign owners',
            },
          },
        ]
      }
    } else if (
      normalizedPrompt.includes('workflow') ||
      normalizedPrompt.includes('automation') ||
      normalizedPrompt.includes('rule')
    ) {
      mode = 'planning'
      status = 'awaiting_approval'
      title = 'Automation Draft'
      summary = 'I drafted an approval-ready automation based on the operational signals in your workspace. Review the trigger, action chain, and safeguards before deployment.'
      artifacts = [
        {
          type: 'automation_plan',
          title: 'Priority escalation workflow',
          trigger:
            maintenanceAssets[0]
              ? `If asset ${maintenanceAssets[0].name} stays in maintenance for more than 24 hours`
              : 'If a high-priority task remains incomplete for more than 24 hours',
          actions: [
            'Create a critical follow-up task',
            'Notify the on-call manager in the dashboard',
            'Append a note to the operations timeline',
          ],
          safeguards: [
            'Rate-limit to one escalation per asset per day',
            'Require manager approval before customer-facing notifications',
            'Do not trigger outside business hours without critical severity',
          ],
          approvalLabel: 'Approve automation draft',
        },
      ]
      actions = [
        {
          type: 'create_automation',
          label: 'Approve and stage automation',
          payload: {
            name: 'Priority Escalation Workflow',
            summary: 'Escalates prolonged maintenance or blocked high-priority work.',
          },
        },
      ]
      suggestedPrompts = [
        'Create a task instead of an automation',
        'Show the fleet health risks behind this draft',
        'Summarize this workflow for an executive update',
      ]
    } else if (
      normalizedPrompt.includes('knowledge') ||
      normalizedPrompt.includes('note') ||
      normalizedPrompt.includes('policy') ||
      normalizedPrompt.includes('document')
    ) {
      mode = 'analysis'
      title = 'Knowledge Digest'
      summary = `I synthesized the most relevant saved knowledge. ${pinnedNotes.length} pinned notes stand out as the best starting point for this request.`
      artifacts = [
        {
          type: 'knowledge_digest',
          title: 'Relevant knowledge',
          highlights: pinnedNotes.length
            ? pinnedNotes.map((note) => `${note.title}: ${note.category} guidance updated recently.`)
            : ['No pinned notes were found, so I recommend capturing a short operating note from this conversation.'],
          sources: pinnedNotes.map((note) => note.title),
        },
      ]
      actions = [
        {
          type: 'create_note',
          label: 'Save a new operating note',
          payload: {
            title: 'Copilot operating note',
            content: summary,
            category: 'Operations',
          },
        },
      ]
    }

    const steps: CopilotRunResponse['steps'] = [
      {
        id: 'collect-context',
        title: 'Collect workspace context',
        detail: `Reviewed ${context.tasks.length} tasks, ${context.assets.length} assets, and ${context.notes.length} notes.`,
        status: 'completed',
      },
      {
        id: 'plan',
        title: 'Generate execution plan',
        detail: `Mapped prompt intent to ${mode} mode with an artifact-backed response.`,
        status: 'completed',
      },
      {
        id: 'deliver',
        title: status === 'awaiting_approval' ? 'Await approval' : 'Deliver response',
        detail:
          status === 'awaiting_approval'
            ? 'A reversible action is available, but it requires explicit approval.'
            : 'Response is ready with no additional approvals required.',
        status: status === 'awaiting_approval' ? 'awaiting_approval' : 'completed',
      },
    ]

    const response: CopilotRunResponse = {
      id: `run_${Math.random().toString(36).slice(2, 10)}`,
      status,
      mode,
      title,
      summary,
      steps,
      artifacts,
      actions,
      suggestedPrompts,
    }

    res.json(response)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: error.errors })
    }

    return res.status(500).json({
      error: 'Copilot run failed',
      message: error.message || 'Unexpected server error',
    })
  }
})

export default router
