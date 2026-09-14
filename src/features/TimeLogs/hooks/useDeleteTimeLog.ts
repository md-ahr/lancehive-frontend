import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import { timeLogKeys } from '../query-keys'

type DeleteTimeLogPayload = {
  id: string
  taskId: string
  projectId: string
}

export function useDeleteTimeLog() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id }: DeleteTimeLogPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<void>(`/time-logs/${id}`, {
        method: 'DELETE',
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
      void queryClient.removeQueries({ queryKey: timeLogKeys.detail(variables.id) })
    },
  })
}
