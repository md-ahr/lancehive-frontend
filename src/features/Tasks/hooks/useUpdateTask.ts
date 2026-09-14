import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { TaskResource, UpdateTaskRequest } from '../types'

import { taskKeys } from '../query-keys'

type UpdateTaskPayload = UpdateTaskRequest & {
  id: string
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateTaskPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<TaskResource>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.projectLists() })
      void queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(String(data.project_id)),
      })
      void queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) })
    },
  })
}
