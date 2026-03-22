import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import {
  CopilotContext,
  CopilotRunRequest,
  CopilotRunResponse,
  copilotRunResponseSchema,
} from '../../../shared/copilot'

export function useCopilotRun() {
  return useMutation({
    mutationFn: async (payload: CopilotRunRequest) => {
      const response = await apiFetch('/api/protected/copilot/run', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      return copilotRunResponseSchema.parse(response) as CopilotRunResponse
    },
  })
}

export const buildCopilotContext = (context: CopilotContext) => context
