import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientResource } from '../types'

import { clientKeys } from '../query-keys'

export function useClient(id: string | undefined) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: clientKeys.detail(id ?? ''),
    queryFn: () => apiRequest<ClientResource>(`/clients/${id}`, { freelancerId }),
    enabled: Boolean(freelancerId && id),
  })
}
