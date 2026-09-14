import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { FreelancerListResponse } from '../types'

import { adminFreelancerKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

export function useFreelancerList(cursor?: string, status?: string) {
  return useQuery({
    queryKey: adminFreelancerKeys.list(cursor, status),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<FreelancerListResponse>(`/admin/freelancers?${params.toString()}`)
    },
  })
}
