import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { TimeLogResource, UpdateTimeLogRequest } from '../types'

import { timeLogKeys } from '../query-keys'

type UpdateTimeLogPayload = UpdateTimeLogRequest & {
  id: string
  taskId: string
  projectId: string
}

export function useUpdateTimeLog() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({
      id,
      taskId: _taskId,
      projectId: _projectId,
      ...payload
    }: UpdateTimeLogPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<TimeLogResource>(`/time-logs/${id}`, {
        method: 'PATCH',
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
      void queryClient.invalidateQueries({ queryKey: timeLogKeys.detail(variables.id) })
    },
  })
}
