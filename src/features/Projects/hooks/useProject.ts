import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ProjectResource } from '../types'

import { projectKeys } from '../query-keys'

export function useProject(id: string | undefined) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => apiRequest<ProjectResource>(`/projects/${id}`, { freelancerId }),
    enabled: Boolean(freelancerId && id),
  })
}
