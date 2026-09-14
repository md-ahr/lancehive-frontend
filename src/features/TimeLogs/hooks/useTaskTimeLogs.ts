import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { TimeLogListResponse } from '../types'

import { timeLogKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseTaskTimeLogsOptions = {
  taskId: string | undefined
  cursor?: string
}

export function useTaskTimeLogs({ taskId, cursor }: UseTaskTimeLogsOptions) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: timeLogKeys.taskList(taskId ?? '', { cursor }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }

      return apiRequest<TimeLogListResponse>(`/tasks/${taskId}/time-logs?${params.toString()}`, {
        freelancerId,
      })
    },
    enabled: Boolean(freelancerId && taskId),
  })
}
