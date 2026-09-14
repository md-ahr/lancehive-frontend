import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import { clientKeys } from '../query-keys'

export function useDeleteClient() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: (id: string) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<void>(`/clients/${id}`, {
        method: 'DELETE',
        freelancerId,
      })
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      void queryClient.removeQueries({ queryKey: clientKeys.detail(id) })
    },
  })
}
