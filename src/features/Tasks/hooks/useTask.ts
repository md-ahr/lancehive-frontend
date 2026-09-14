import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { TaskResource } from '../types'

import { taskKeys } from '../query-keys'

export function useTask(id: string | undefined) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => apiRequest<TaskResource>(`/tasks/${id}`, { freelancerId }),
    enabled: Boolean(freelancerId && id),
  })
}
