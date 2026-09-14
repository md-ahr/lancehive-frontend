import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { CreateTaskRequest, TaskResource } from '../types'

import { taskKeys } from '../query-keys'

type CreateTaskPayload = CreateTaskRequest & {
  projectId: string
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ projectId, ...payload }: CreateTaskPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<TaskResource>(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.projectLists() })
      void queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(variables.projectId),
      })
    },
  })
}
