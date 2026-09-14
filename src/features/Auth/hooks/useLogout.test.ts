import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getToken, setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '../stores/useAuthStore'
import { useLogout } from './useLogout'

describe('useLogout', () => {
  beforeEach(() => {
    localStorage.clear()
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })
  })

  it('clears token on success', async () => {
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getToken()).toBeNull()
    expect(useAuthStore.getState().hasToken).toBe(false)
  })
})
