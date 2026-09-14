import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientListResponse } from '../types'

import { clientKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

export function useClientList(cursor?: string) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: clientKeys.list(cursor),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }

      return apiRequest<ClientListResponse>(`/clients?${params.toString()}`, { freelancerId })
    },
    enabled: Boolean(freelancerId),
  })
}
