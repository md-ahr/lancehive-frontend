import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authKeys } from '@/features/Auth/query-keys'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { SubscriptionResource, SwapSubscriptionRequest } from '../types'

import { subscriptionKeys } from '../query-keys'

export function useSwapSubscription() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()

  return useMutation({
    mutationFn: (payload: SwapSubscriptionRequest) =>
      apiRequest<SubscriptionResource>('/subscription/swap', {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail() })
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
