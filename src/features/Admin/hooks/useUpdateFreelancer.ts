import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { FreelancerResource, UpdateFreelancerRequest } from '../types'

import { adminFreelancerKeys } from '../query-keys'

type UpdateFreelancerVariables = UpdateFreelancerRequest & {
  id: string
}

export function useUpdateFreelancer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateFreelancerVariables) =>
      apiRequest<FreelancerResource>(`/admin/freelancers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminFreelancerKeys.lists() })
    },
  })
}
