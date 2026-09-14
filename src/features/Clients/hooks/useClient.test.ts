import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { sampleClients } from '@/test/fixtures/clients'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useClient } from './useClient'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useClient', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns a client by id with freelancer header', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/clients/:id`, ({ request }) => {
        capturedHeader = request.headers.get('X-Freelancer-Id')
        return HttpResponse.json(sampleClients[0])
      }),
    )

    const { result } = renderHook(() => useClient('10'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('BigCo Ltd')
    expect(capturedHeader).toBe('42')
  })

  it('surfaces not found on 404', async () => {
    setToken('missing-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useClient('10'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
