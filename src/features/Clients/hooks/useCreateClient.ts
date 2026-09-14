import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ClientResource, CreateClientRequest } from '../types'

import { clientKeys } from '../query-keys'

export function useCreateClient() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: (payload: CreateClientRequest) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientResource>('/clients', {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}
