import { useMutation } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { MessageResponse, ResetPasswordRequest } from '../types'

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      apiRequest<MessageResponse>('/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  })
}
