import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { defaultUserSettings } from '@/test/fixtures/settings'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useMeSettings } from './useMeSettings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useMeSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns user settings on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useMeSettings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(defaultUserSettings)
  })

  it('surfaces error on 401', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me/settings`, () =>
        HttpResponse.json({ code: 'unauthenticated', message: 'Unauthenticated.' }, { status: 401 }),
      ),
    )

    const { result } = renderHook(() => useMeSettings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
