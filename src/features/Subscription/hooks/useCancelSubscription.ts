import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authKeys } from '@/features/Auth/query-keys'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { SubscriptionResource } from '../types'

import { subscriptionKeys } from '../query-keys'

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()

  return useMutation({
    mutationFn: () =>
      apiRequest<SubscriptionResource>('/subscription/cancel', {
        method: 'POST',
        freelancerId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail() })
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
