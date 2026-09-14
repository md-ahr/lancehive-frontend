import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { defaultWorkspaceSettings } from '@/test/fixtures/settings'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceSettings } from './useWorkspaceSettings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useWorkspaceSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns workspace settings with freelancer header', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/workspace/settings`, ({ request }) => {
        capturedHeader = request.headers.get('X-Freelancer-Id')
        return HttpResponse.json(defaultWorkspaceSettings)
      }),
    )

    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(defaultWorkspaceSettings)
    expect(capturedHeader).toBe('42')
  })

  it('surfaces error on 403', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/workspace/settings`, () =>
        HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 }),
      ),
    )

    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
