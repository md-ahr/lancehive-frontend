import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useFreelancerList } from './useFreelancerList'

describe('useFreelancerList', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('fetches freelancer list for super admin', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useFreelancerList(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.data[0].name).toBe('Acme Studio')
  })
})
