import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ProjectListResponse } from '../types'

import { projectKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseClientProjectsOptions = {
  clientId: string | undefined
  cursor?: string
  status?: string
}

export function useClientProjects({ clientId, cursor, status }: UseClientProjectsOptions) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: projectKeys.clientList(clientId ?? '', { cursor, status }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<ProjectListResponse>(`/clients/${clientId}/projects?${params.toString()}`, {
        freelancerId,
      })
    },
    enabled: Boolean(freelancerId && clientId),
  })
}
