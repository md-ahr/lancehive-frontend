import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { adminFreelancerKeys } from '../query-keys'
import { useCreateFreelancer } from './useCreateFreelancer'

describe('useCreateFreelancer', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a workspace and invalidates freelancer list', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: adminFreelancerKeys.list() })

    const { result } = renderHook(() => useCreateFreelancer(), {
      wrapper: createWrapper({ queryClient }),
    })

    await result.current.mutateAsync({
      workspace_name: 'New Studio',
      owner_name: 'New Owner',
      owner_email: 'owner@newstudio.test',
      trial_days: 14,
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(adminFreelancerKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
