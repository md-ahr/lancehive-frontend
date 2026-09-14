import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'
import { setToken } from '@/lib/auth-storage'

import type { LoginRequest, LoginResponse } from '../types'

import { authKeys } from '../query-keys'
import { useAuthStore } from '../stores/useAuthStore'

export function useLogin() {
  const queryClient = useQueryClient()
  const setHasToken = useAuthStore((state) => state.setHasToken)

  return useMutation({
    mutationFn: (payload: LoginRequest) =>
      apiRequest<LoginResponse>('/login', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (data) => {
      setToken(data.token)
      setHasToken(true)
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
