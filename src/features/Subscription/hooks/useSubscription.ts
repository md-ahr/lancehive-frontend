import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { SubscriptionDetailResource } from '../types'

import { subscriptionKeys } from '../query-keys'

type UseSubscriptionOptions = {
  enabled?: boolean
}

export function useSubscription(options: UseSubscriptionOptions = {}) {
  const { freelancerId } = useWorkspaceContext()
  const { enabled = true } = options

  return useQuery({
    queryKey: subscriptionKeys.detail(),
    queryFn: () => apiRequest<SubscriptionDetailResource>('/subscription', { freelancerId }),
    enabled: Boolean(freelancerId) && enabled,
  })
}
