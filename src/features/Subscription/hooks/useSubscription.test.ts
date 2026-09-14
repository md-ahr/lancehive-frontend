import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { trialingSubscription } from '@/test/fixtures/subscription'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useSubscription } from './useSubscription'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useSubscription', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns subscription detail on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe(trialingSubscription.status)
    expect(result.current.data?.plan?.name).toBe('Starter')
  })

  it('sends X-Freelancer-Id header', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let freelancerHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/subscription`, ({ request }) => {
        freelancerHeader = request.headers.get('X-Freelancer-Id')
        return HttpResponse.json(trialingSubscription)
      }),
    )

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(freelancerHeader).toBe('42')
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/subscription`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('does not fetch when disabled', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let requestCount = 0
    server.use(
      http.get(`${API_BASE_URL}/subscription`, () => {
        requestCount += 1
        return HttpResponse.json(trialingSubscription)
      }),
    )

    renderHook(() => useSubscription({ enabled: false }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(requestCount).toBe(0))
  })
})
