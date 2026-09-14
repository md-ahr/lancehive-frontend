import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api'

import type { PortalProjectListResponse } from '../types'

import { portalKeys } from '../query-keys'
import { usePortalContext } from './usePortalContext'

const DEFAULT_PER_PAGE = 25

type UsePortalProjectsOptions = {
  cursor?: string
}

export function usePortalProjects({ cursor }: UsePortalProjectsOptions = {}) {
  const { clientId } = usePortalContext()

  return useQuery({
    queryKey: portalKeys.projectList({ cursor }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }

      return apiRequest<PortalProjectListResponse>(`/portal/projects?${params.toString()}`, {
        clientId,
      })
    },
    enabled: Boolean(clientId),
  })
}
