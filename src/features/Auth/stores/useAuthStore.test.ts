import { beforeEach, describe, expect, it } from 'vitest'

import { setToken, clearToken } from '@/lib/auth-storage'

import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: false })
  })

  it('hydrates token presence from storage', () => {
    setToken('stored-token')

    useAuthStore.getState().hydrate()

    expect(useAuthStore.getState().isHydrated).toBe(true)
    expect(useAuthStore.getState().hasToken).toBe(true)
  })

  it('hydrates as unauthenticated when storage is empty', () => {
    useAuthStore.getState().hydrate()

    expect(useAuthStore.getState().isHydrated).toBe(true)
    expect(useAuthStore.getState().hasToken).toBe(false)
  })

  it('updates hasToken when setHasToken is called', () => {
    useAuthStore.getState().setHasToken(true)
    expect(useAuthStore.getState().hasToken).toBe(true)

    clearToken()
    useAuthStore.getState().setHasToken(false)
    expect(useAuthStore.getState().hasToken).toBe(false)
  })
})
