import { useQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { apiRequest } from '@/lib/api'

import type { UserSettingsResource } from '../types'

import { settingsKeys } from '../query-keys'

export function useMeSettings() {
  const hasToken = useAuthStore((state) => state.hasToken)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  return useQuery({
    queryKey: settingsKeys.me(),
    queryFn: () => apiRequest<UserSettingsResource>('/me/settings'),
    enabled: isHydrated && hasToken,
  })
}
