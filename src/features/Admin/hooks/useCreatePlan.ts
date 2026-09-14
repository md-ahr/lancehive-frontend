import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PlanResource } from '@/features/Subscription/types'

import { apiRequest } from '@/lib/api'

import { adminPlanKeys } from '../query-keys'

export function useCreatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<PlanResource>) =>
      apiRequest<PlanResource>('/admin/plans', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPlanKeys.lists() })
    },
  })
}
