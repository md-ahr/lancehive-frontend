import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { clientKeys } from '../query-keys'
import { useDeleteClient } from './useDeleteClient'

function useDeleteClientProbe() {
  const context = useWorkspaceContext()
  const mutation = useDeleteClient()

  return { context, mutation }
}

describe('useDeleteClient', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('deletes a client and invalidates client list', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: clientKeys.list() })
    await queryClient.prefetchQuery({ queryKey: clientKeys.detail('10') })

    const { result } = renderHook(() => useDeleteClientProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync('10')

    await waitFor(() => {
      expect(queryClient.getQueryState(clientKeys.list())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryData(clientKeys.detail('10'))).toBeUndefined()
    })
  })
})
