import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import { projectKeys } from '../query-keys'

type DeleteProjectPayload = {
  id: string
  clientId: string
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id }: DeleteProjectPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<void>(`/projects/${id}`, {
        method: 'DELETE',
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: projectKeys.clientLists() })
      void queryClient.invalidateQueries({
        queryKey: projectKeys.clientList(variables.clientId),
      })
      void queryClient.removeQueries({ queryKey: projectKeys.detail(variables.id) })
    },
  })
}
