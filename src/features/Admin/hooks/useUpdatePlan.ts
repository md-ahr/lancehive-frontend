import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PlanResource } from '@/features/Subscription/types'

import { apiRequest } from '@/lib/api'

import { adminPlanKeys } from '../query-keys'

type UpdatePlanVariables = Omit<Partial<PlanResource>, 'id'> & {
  id: string
}

export function useUpdatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePlanVariables) =>
      apiRequest<PlanResource>(`/admin/plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPlanKeys.lists() })
    },
  })
}
