import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { sampleProjects } from '@/test/fixtures/projects'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useProject } from './useProject'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useProject', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns a project by id', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useProject('20'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe(sampleProjects[0].name)
  })

  it('surfaces not found error', async () => {
    setToken('missing-project-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useProject('20'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:id`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useProject('20'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
