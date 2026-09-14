import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { clientProjectsResponse } from '@/test/fixtures/projects'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useClientProjects } from './useClientProjects'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useClientProjects', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns projects scoped to a client', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedPath = ''
    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/projects`, ({ request }) => {
        capturedPath = new URL(request.url).pathname
        return HttpResponse.json(clientProjectsResponse(10))
      }),
    )

    const { result } = renderHook(() => useClientProjects({ clientId: '10' }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(capturedPath).toBe('/api/v1/clients/10/projects')
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/projects`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useClientProjects({ clientId: '10' }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
