import { z } from 'zod'
import type { AssistantAction } from './types.js'

export const copilotContextSchema = z.object({
  userName: z.string().optional(),
  page: z.string().optional(),
  tasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
        priority: z.enum(['low', 'medium', 'high']),
        dueDate: z.string().optional(),
      }),
    )
    .default([]),
  notes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        category: z.string(),
        pinned: z.boolean(),
        updatedAt: z.string(),
      }),
    )
    .default([]),
  assets: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        status: z.enum(['available', 'in-use', 'maintenance', 'retired']),
        health: z.number(),
        location: z.string(),
      }),
    )
    .default([]),
})

export const copilotRunRequestSchema = z.object({
  prompt: z.string().min(2, 'Prompt must be at least 2 characters'),
  context: copilotContextSchema,
})

export const copilotStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked', 'awaiting_approval']),
})

const operationalBriefArtifactSchema = z.object({
  type: z.literal('operational_brief'),
  title: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), tone: z.enum(['default', 'success', 'warning', 'danger']) })),
  alerts: z.array(z.object({ title: z.string(), detail: z.string(), severity: z.enum(['info', 'warning', 'critical']) })),
})

const taskBacklogArtifactSchema = z.object({
  type: z.literal('task_backlog'),
  title: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      completed: z.boolean(),
      dueDate: z.string().optional(),
    }),
  ),
})

const fleetHealthArtifactSchema = z.object({
  type: z.literal('fleet_health'),
  title: z.string(),
  averageHealth: z.number(),
  inMaintenance: z.number(),
  activeAssets: z.number(),
  criticalAssets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      health: z.number(),
      status: z.enum(['available', 'in-use', 'maintenance', 'retired']),
    }),
  ),
})

const automationPlanArtifactSchema = z.object({
  type: z.literal('automation_plan'),
  title: z.string(),
  trigger: z.string(),
  actions: z.array(z.string()),
  safeguards: z.array(z.string()),
  approvalLabel: z.string(),
})

const knowledgeDigestArtifactSchema = z.object({
  type: z.literal('knowledge_digest'),
  title: z.string(),
  highlights: z.array(z.string()),
  sources: z.array(z.string()),
})

export const copilotArtifactSchema = z.discriminatedUnion('type', [
  operationalBriefArtifactSchema,
  taskBacklogArtifactSchema,
  fleetHealthArtifactSchema,
  automationPlanArtifactSchema,
  knowledgeDigestArtifactSchema,
])

export const copilotRunResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['completed', 'awaiting_approval']),
  mode: z.enum(['briefing', 'analysis', 'execution', 'planning']),
  title: z.string(),
  summary: z.string(),
  steps: z.array(copilotStepSchema),
  artifacts: z.array(copilotArtifactSchema),
  actions: z.array(z.custom<AssistantAction>()).default([]),
  suggestedPrompts: z.array(z.string()).default([]),
})

export type CopilotContext = z.infer<typeof copilotContextSchema>
export type CopilotRunRequest = z.infer<typeof copilotRunRequestSchema>
export type CopilotStep = z.infer<typeof copilotStepSchema>
export type CopilotArtifact = z.infer<typeof copilotArtifactSchema>
export type CopilotRunResponse = z.infer<typeof copilotRunResponseSchema>
