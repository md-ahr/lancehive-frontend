import { useMutation } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { ForgotPasswordRequest, MessageResponse } from '../types'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      apiRequest<MessageResponse>('/forgot-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  })
}
