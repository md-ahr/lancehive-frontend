import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { MemberListResponse } from '../types'

import { memberKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

export function useMemberList(cursor?: string) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: memberKeys.list(cursor),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }

      return apiRequest<MemberListResponse>(`/members?${params.toString()}`, { freelancerId })
    },
    enabled: Boolean(freelancerId),
  })
}
