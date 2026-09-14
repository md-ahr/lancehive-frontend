import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { authKeys } from '@/features/Auth/query-keys'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { settingsKeys } from '../query-keys'
import { useUpdateMeSettings } from './useUpdateMeSettings'

describe('useUpdateMeSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates settings and invalidates authKeys.me()', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: authKeys.me() })
    await queryClient.prefetchQuery({ queryKey: settingsKeys.me() })

    const { result } = renderHook(() => useUpdateMeSettings(), {
      wrapper: createWrapper({ queryClient }),
    })

    await result.current.mutateAsync({ timezone: 'UTC', locale: 'en' })

    await waitFor(() => {
      expect(queryClient.getQueryState(authKeys.me())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(settingsKeys.me())?.isInvalidated).toBe(true)
    })
  })
})
