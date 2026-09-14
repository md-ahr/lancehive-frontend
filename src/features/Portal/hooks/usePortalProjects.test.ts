import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { portalProjectsResponse } from '@/test/fixtures/portal'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { usePortalProjects } from './usePortalProjects'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('usePortalProjects', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns paginated projects on success', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => usePortalProjects(), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(portalProjectsResponse.data.length)
  })

  it('sends X-Client-Id header', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let clientHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/portal/projects`, ({ request }) => {
        clientHeader = request.headers.get('X-Client-Id')
        return HttpResponse.json(portalProjectsResponse)
      }),
    )

    const { result } = renderHook(() => usePortalProjects(), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clientHeader).toBe('10')
  })

  it('surfaces error on 500', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/portal/projects`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => usePortalProjects(), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
