import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ProjectTimeSummaryResource } from '../types'

import { timeLogKeys } from '../query-keys'

export function useProjectTimeSummary(projectId: string | undefined) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: timeLogKeys.projectSummary(projectId ?? ''),
    queryFn: () =>
      apiRequest<ProjectTimeSummaryResource>(`/projects/${projectId}/time-summary`, {
        freelancerId,
      }),
    enabled: Boolean(freelancerId && projectId),
  })
}
