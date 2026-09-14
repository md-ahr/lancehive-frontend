import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { emptyProjectListResponse, sampleProjects } from '@/test/fixtures/projects'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useProjectList } from './useProjectList'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useProjectList', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns paginated projects with freelancer header', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/projects`, ({ request }) => {
        capturedHeader = request.headers.get('X-Freelancer-Id')
        return HttpResponse.json({
          data: sampleProjects,
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    const { result } = renderHook(() => useProjectList(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(3)
    expect(capturedHeader).toBe('42')
  })

  it('passes cursor query param', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedCursor: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/projects`, ({ request }) => {
        capturedCursor = new URL(request.url).searchParams.get('cursor')
        return HttpResponse.json(emptyProjectListResponse)
      }),
    )

    const { result } = renderHook(() => useProjectList({ cursor: 'page-2' }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(capturedCursor).toBe('page-2')
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useProjectList(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
