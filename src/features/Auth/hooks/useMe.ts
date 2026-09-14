import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { MeResponse } from '../types'

import { authKeys } from '../query-keys'
import { useAuthStore } from '../stores/useAuthStore'

export function useMe() {
  const hasToken = useAuthStore((state) => state.hasToken)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => apiRequest<MeResponse>('/me'),
    enabled: isHydrated && hasToken,
  })
}
