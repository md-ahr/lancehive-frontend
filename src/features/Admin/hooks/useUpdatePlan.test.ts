import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { adminPlanKeys } from '../query-keys'
import { useUpdatePlan } from './useUpdatePlan'

describe('useUpdatePlan', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates a plan and invalidates plan list', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: adminPlanKeys.list() })

    const { result } = renderHook(() => useUpdatePlan(), {
      wrapper: createWrapper({ queryClient }),
    })

    const updated = await result.current.mutateAsync({
      id: '1',
      name: 'Starter Plus',
    })

    expect(updated.name).toBe('Starter Plus')

    await waitFor(() => {
      expect(queryClient.getQueryState(adminPlanKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
