import { useMutation } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { MessageResponse } from '../types'

export function useResendInvite() {
  return useMutation({
    mutationFn: (freelancerId: string) =>
      apiRequest<MessageResponse>(`/admin/freelancers/${freelancerId}/resend-invite`, {
        method: 'POST',
      }),
  })
}
