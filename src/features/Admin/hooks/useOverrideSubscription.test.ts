import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { adminFreelancerKeys } from '../query-keys'
import { useOverrideSubscription } from './useOverrideSubscription'

describe('useOverrideSubscription', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('overrides subscription and invalidates freelancer list', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: adminFreelancerKeys.list() })

    const { result } = renderHook(() => useOverrideSubscription(), {
      wrapper: createWrapper({ queryClient }),
    })

    const updated = await result.current.mutateAsync({
      freelancerId: '5',
      plan_id: 2,
      provider: 'manual',
    })

    expect(updated.plan_id).toBe(2)
    expect(updated.provider).toBe('manual')

    await waitFor(() => {
      expect(queryClient.getQueryState(adminFreelancerKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
