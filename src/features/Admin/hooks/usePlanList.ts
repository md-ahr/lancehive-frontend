import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { PlanListResponse } from '../types'

import { adminPlanKeys } from '../query-keys'

export function usePlanList(isActive?: boolean) {
  return useQuery({
    queryKey: adminPlanKeys.list(isActive),
    queryFn: () => {
      const params = new URLSearchParams()
      if (isActive !== undefined) {
        params.set('is_active', String(isActive))
      }

      const query = params.toString()
      const path = query ? `/admin/plans?${query}` : '/admin/plans'

      return apiRequest<PlanListResponse>(path)
    },
  })
}
