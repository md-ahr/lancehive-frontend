import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { projectKeys } from '../query-keys'
import { useCreateProject } from './useCreateProject'

function useCreateProjectProbe() {
  const context = useWorkspaceContext()
  const mutation = useCreateProject()

  return { context, mutation }
}

describe('useCreateProject', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a project under a client and invalidates lists', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: projectKeys.list() })
    await queryClient.prefetchQuery({ queryKey: projectKeys.clientList('10') })

    const { result } = renderHook(() => useCreateProjectProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      clientId: '10',
      name: 'New Project',
      hourly_rate: '1500.00',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(projectKeys.list())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(projectKeys.clientList('10'))?.isInvalidated).toBe(true)
    })
  })
})
