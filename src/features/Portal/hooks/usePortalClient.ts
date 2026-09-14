import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { PortalClientResponse } from '../types'

import { portalKeys } from '../query-keys'
import { usePortalContext } from './usePortalContext'

export function usePortalClient() {
  const { clientId } = usePortalContext()

  return useQuery({
    queryKey: portalKeys.client(),
    queryFn: () => apiRequest<PortalClientResponse>('/portal/client', { clientId }),
    enabled: Boolean(clientId),
  })
}
