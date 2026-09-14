import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { CreateTimeLogRequest, TimeLogResource } from '../types'

import { timeLogKeys } from '../query-keys'

type CreateTimeLogPayload = CreateTimeLogRequest & {
  taskId: string
  projectId: string
}

export function useCreateTimeLog() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ taskId, projectId: _projectId, ...payload }: CreateTimeLogPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<TimeLogResource>(`/tasks/${taskId}/time-logs`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: timeLogKeys.taskLists() })
      void queryClient.invalidateQueries({
        queryKey: timeLogKeys.taskList(variables.taskId),
      })
      void queryClient.invalidateQueries({
        queryKey: timeLogKeys.projectSummary(variables.projectId),
      })
    },
  })
}
