import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { projectKeys } from '../query-keys'
import { useUpdateProject } from './useUpdateProject'

function useUpdateProjectProbe() {
  const context = useWorkspaceContext()
  const mutation = useUpdateProject()

  return { context, mutation }
}

describe('useUpdateProject', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('updates a project and invalidates list and detail', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: projectKeys.list() })
    await queryClient.prefetchQuery({ queryKey: projectKeys.detail('20') })

    const { result } = renderHook(() => useUpdateProjectProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      id: '20',
      name: 'Updated Project',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(projectKeys.list())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(projectKeys.detail('20'))?.isInvalidated).toBe(true)
    })
  })
})
