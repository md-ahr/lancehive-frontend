import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { getToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '../stores/useAuthStore'
import { useLogin } from './useLogin'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useLogin', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('stores token on success', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'jane@example.com', password: 'secret' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getToken()).toBe('test-token')
    expect(useAuthStore.getState().hasToken).toBe(true)
  })

  it('surfaces error on invalid credentials', async () => {
    server.use(
      http.post(`${API_BASE_URL}/login`, () =>
        HttpResponse.json(
          {
            code: 'validation_failed',
            message: 'The given data was invalid.',
            errors: { email: ['These credentials do not match our records.'] },
          },
          { status: 422 },
        ),
      ),
    )

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'jane@example.com', password: 'wrong' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(getToken()).toBeNull()
    expect(useAuthStore.getState().hasToken).toBe(false)
  })

  it('surfaces error on 401', async () => {
    server.use(
      http.post(`${API_BASE_URL}/login`, () =>
        HttpResponse.json(
          { code: 'unauthenticated', message: 'Unauthenticated.' },
          { status: 401 },
        ),
      ),
    )

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'jane@example.com', password: 'secret' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(getToken()).toBeNull()
  })
})
