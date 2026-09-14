import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { adminPlanKeys } from '../query-keys'
import { useCreatePlan } from './useCreatePlan'

describe('useCreatePlan', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a plan and invalidates plan list', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: adminPlanKeys.list() })

    const { result } = renderHook(() => useCreatePlan(), {
      wrapper: createWrapper({ queryClient }),
    })

    await result.current.mutateAsync({
      name: 'Enterprise',
      slug: 'enterprise',
      price_monthly: '1000.00',
      currency: 'BDT',
      is_custom: true,
      is_active: true,
      sort_order: 3,
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(adminPlanKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
