import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useResendInvite } from './useResendInvite'

describe('useResendInvite', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('resends invite for a pending freelancer', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useResendInvite(), {
      wrapper: createWrapper(),
    })

    const response = await result.current.mutateAsync('6')

    await waitFor(() => {
      expect(response.message).toMatch(/resent/i)
    })
  })
})
