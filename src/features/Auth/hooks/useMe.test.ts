import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '../stores/useAuthStore'
import { useMe } from './useMe'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useMe', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('does not fetch when token is absent', () => {
    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('returns memberships on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.memberships).toHaveLength(1)
    expect(result.current.data?.user.role).toBe('freelancer')
  })

  it('surfaces error on 401', async () => {
    setToken('invalid-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () =>
        HttpResponse.json({ code: 'unauthenticated', message: 'Unauthenticated.' }, { status: 401 }),
      ),
    )

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
