import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientMemberListResponse } from '../types'

import { clientMemberKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

export function useClientMemberList(clientId: string, cursor?: string) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: clientMemberKeys.list(clientId, cursor),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }

      return apiRequest<ClientMemberListResponse>(
        `/clients/${clientId}/members?${params.toString()}`,
        { freelancerId },
      )
    },
    enabled: Boolean(freelancerId && clientId),
  })
}
