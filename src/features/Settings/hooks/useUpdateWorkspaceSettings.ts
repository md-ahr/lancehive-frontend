import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { UpdateWorkspaceSettingsRequest, WorkspaceSettingsResource } from '../types'

import { settingsKeys } from '../query-keys'

export function useUpdateWorkspaceSettings() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceSettingsRequest) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      return apiRequest<WorkspaceSettingsResource>('/workspace/settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.workspace() })
    },
  })
}
