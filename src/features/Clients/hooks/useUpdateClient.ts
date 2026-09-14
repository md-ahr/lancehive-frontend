import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ClientResource, UpdateClientRequest } from '../types'

import { clientKeys } from '../query-keys'

type UpdateClientPayload = UpdateClientRequest & {
  id: string
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateClientPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientResource>(`/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) })
    },
  })
}
