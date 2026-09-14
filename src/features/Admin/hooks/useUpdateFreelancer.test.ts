import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { adminFreelancerKeys } from '../query-keys'
import { useUpdateFreelancer } from './useUpdateFreelancer'

describe('useUpdateFreelancer', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates freelancer status and invalidates list', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: adminFreelancerKeys.list() })

    const { result } = renderHook(() => useUpdateFreelancer(), {
      wrapper: createWrapper({ queryClient }),
    })

    const updated = await result.current.mutateAsync({ id: '5', status: 'suspended' })

    expect(updated.status).toBe('suspended')

    await waitFor(() => {
      expect(queryClient.getQueryState(adminFreelancerKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
