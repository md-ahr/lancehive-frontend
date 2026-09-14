import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { CreateFreelancerRequest, FreelancerDetailResource } from '../types'

import { adminFreelancerKeys } from '../query-keys'

export function useCreateFreelancer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFreelancerRequest) =>
      apiRequest<FreelancerDetailResource>('/admin/freelancers', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminFreelancerKeys.lists() })
    },
  })
}
