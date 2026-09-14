import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { clientKeys } from '../query-keys'
import { useUpdateClient } from './useUpdateClient'

function useUpdateClientProbe() {
  const context = useWorkspaceContext()
  const mutation = useUpdateClient()

  return { context, mutation }
}

describe('useUpdateClient', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates a client and invalidates list and detail', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: clientKeys.list() })
    await queryClient.prefetchQuery({ queryKey: clientKeys.detail('10') })

    const { result } = renderHook(() => useUpdateClientProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      id: '10',
      name: 'Updated Client',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(clientKeys.list())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(clientKeys.detail('10'))?.isInvalidated).toBe(true)
    })
  })
})
