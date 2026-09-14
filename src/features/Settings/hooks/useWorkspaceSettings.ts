import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { WorkspaceSettingsResource } from '../types'

import { settingsKeys } from '../query-keys'

export function useWorkspaceSettings() {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: settingsKeys.workspace(),
    queryFn: () =>
      apiRequest<WorkspaceSettingsResource>('/workspace/settings', { freelancerId }),
    enabled: Boolean(freelancerId),
  })
}
