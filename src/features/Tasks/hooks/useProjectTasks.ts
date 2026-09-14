import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { TaskListResponse } from '../types'

import { taskKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseProjectTasksOptions = {
  projectId: string | undefined
  cursor?: string
  status?: string
}

export function useProjectTasks({ projectId, cursor, status }: UseProjectTasksOptions) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: taskKeys.projectList(projectId ?? '', { cursor, status }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<TaskListResponse>(`/projects/${projectId}/tasks?${params.toString()}`, {
        freelancerId,
      })
    },
    enabled: Boolean(freelancerId && projectId),
  })
}
