import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ProjectListResponse } from '../types'

import { projectKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseProjectListOptions = {
  cursor?: string
  status?: string
  client_id?: string
}

export function useProjectList(options: UseProjectListOptions = {}) {
  const { cursor, status, client_id } = options
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: projectKeys.list({ cursor, status, client_id }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }
      if (client_id) {
        params.set('client_id', client_id)
      }

      return apiRequest<ProjectListResponse>(`/projects?${params.toString()}`, { freelancerId })
    },
    enabled: Boolean(freelancerId),
  })
}
