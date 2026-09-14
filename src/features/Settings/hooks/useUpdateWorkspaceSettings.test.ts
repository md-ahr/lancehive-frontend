import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'

import { setToken } from '@/lib/auth-storage'
import { ApiError } from '@/lib/errors'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { useUpdateWorkspaceSettings } from './useUpdateWorkspaceSettings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function useWorkspaceMutationProbe() {
  const context = useWorkspaceContext()
  const mutation = useUpdateWorkspaceSettings()

  return { context, mutation }
}

describe('useUpdateWorkspaceSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates workspace settings on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useWorkspaceMutationProbe(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const response = await result.current.mutation.mutateAsync({ business_name: 'Updated Studio' })
    expect(response.business_name).toBe('Updated Studio')
  })

  it('blocks mutation when workspace is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())),
    )

    const { result } = renderHook(() => useWorkspaceMutationProbe(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.isReadOnly).toBe(true))

    await expect(
      result.current.mutation.mutateAsync({ business_name: 'Blocked' }),
    ).rejects.toBeInstanceOf(ApiError)
  })
})
