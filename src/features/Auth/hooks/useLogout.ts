import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'
import { clearToken } from '@/lib/auth-storage'

import type { MessageResponse } from '../types'

import { authKeys } from '../query-keys'
import { useAuthStore } from '../stores/useAuthStore'

export function useLogout() {
  const queryClient = useQueryClient()
  const setHasToken = useAuthStore((state) => state.setHasToken)

  return useMutation({
    mutationFn: () => apiRequest<MessageResponse>('/logout', { method: 'POST' }),
    onSuccess: () => {
      clearToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}
