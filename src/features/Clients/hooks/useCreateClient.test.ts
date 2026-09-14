import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { clientKeys } from '../query-keys'
import { useCreateClient } from './useCreateClient'

function useCreateClientProbe() {
  const context = useWorkspaceContext()
  const mutation = useCreateClient()

  return { context, mutation }
}

describe('useCreateClient', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a client and invalidates client list', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: clientKeys.list() })

    const { result } = renderHook(() => useCreateClientProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      name: 'New Client',
      contact_email: 'new@client.test',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(clientKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
