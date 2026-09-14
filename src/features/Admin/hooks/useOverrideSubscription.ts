import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SubscriptionResource } from '@/features/Subscription/types'

import { apiRequest } from '@/lib/api'

import type { OverrideSubscriptionRequest } from '../types'

import { adminFreelancerKeys } from '../query-keys'

type OverrideSubscriptionVariables = OverrideSubscriptionRequest & {
  freelancerId: string
}

export function useOverrideSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ freelancerId, ...payload }: OverrideSubscriptionVariables) =>
      apiRequest<SubscriptionResource>(`/admin/freelancers/${freelancerId}/subscription`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminFreelancerKeys.lists() })
    },
  })
}
