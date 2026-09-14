import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import { taskKeys } from '../query-keys'

type DeleteTaskPayload = {
  id: string
  projectId: string
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id }: DeleteTaskPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<void>(`/tasks/${id}`, {
        method: 'DELETE',
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.projectLists() })
      void queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(variables.projectId),
      })
      void queryClient.removeQueries({ queryKey: taskKeys.detail(variables.id) })
    },
  })
}
