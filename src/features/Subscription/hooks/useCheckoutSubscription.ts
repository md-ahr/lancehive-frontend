import { useMutation } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { CheckoutRequest, CheckoutResponse } from '../types'

export function useCheckoutSubscription() {
  const { freelancerId } = useWorkspaceContext()

  return useMutation({
    mutationFn: (payload: CheckoutRequest) =>
      apiRequest<CheckoutResponse>('/subscription/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      }),
  })
}
