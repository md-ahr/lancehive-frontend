import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ProjectResource, UpdateProjectRequest } from '../types'

import { projectKeys } from '../query-keys'

type UpdateProjectPayload = UpdateProjectRequest & {
  id: string
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateProjectPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ProjectResource>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: projectKeys.clientLists() })
      void queryClient.invalidateQueries({
        queryKey: projectKeys.clientList(String(data.client_id)),
      })
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) })
    },
  })
}
