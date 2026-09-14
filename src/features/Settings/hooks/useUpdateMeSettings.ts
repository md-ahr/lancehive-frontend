import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authKeys } from '@/features/Auth/query-keys'
import { apiRequest } from '@/lib/api'

import type { UpdateUserSettingsRequest, UserSettingsResource } from '../types'

import { settingsKeys } from '../query-keys'

export function useUpdateMeSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserSettingsRequest) =>
      apiRequest<UserSettingsResource>('/me/settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.me() })
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
