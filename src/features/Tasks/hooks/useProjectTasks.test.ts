import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { projectTasksResponse } from '@/test/fixtures/tasks'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useProjectTasks } from './useProjectTasks'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useProjectTasks', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns tasks scoped to a project', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedPath = ''
    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/tasks`, ({ request }) => {
        capturedPath = new URL(request.url).pathname
        return HttpResponse.json(projectTasksResponse(20))
      }),
    )

    const { result } = renderHook(() => useProjectTasks({ projectId: '20' }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(capturedPath).toBe('/api/v1/projects/20/tasks')
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/tasks`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useProjectTasks({ projectId: '20' }), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
