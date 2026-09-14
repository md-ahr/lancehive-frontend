import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { CreateProjectRequest, ProjectResource } from '../types'

import { projectKeys } from '../query-keys'

type CreateProjectPayload = CreateProjectRequest & {
  clientId: string
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ clientId, ...payload }: CreateProjectPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ProjectResource>(`/clients/${clientId}/projects`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: projectKeys.clientLists(),
      })
      void queryClient.invalidateQueries({
        queryKey: projectKeys.clientList(variables.clientId),
      })
    },
  })
}
