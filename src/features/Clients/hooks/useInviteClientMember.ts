import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ClientMemberResource, InviteClientMemberRequest } from '../types'

import { clientMemberKeys } from '../query-keys'

type InviteClientMemberPayload = InviteClientMemberRequest & {
  clientId: string
}

export function useInviteClientMember() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ clientId, ...payload }: InviteClientMemberPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientMemberResource>(`/clients/${clientId}/members`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: clientMemberKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: clientMemberKeys.list(variables.clientId),
      })
    },
  })
}
