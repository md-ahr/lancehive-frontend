import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { taskKeys } from '../query-keys'
import { useDeleteTask } from './useDeleteTask'

function useDeleteTaskProbe() {
  const context = useWorkspaceContext()
  const mutation = useDeleteTask()

  return { context, mutation }
}

describe('useDeleteTask', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('deletes a task and invalidates lists', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: taskKeys.projectList('20') })
    await queryClient.prefetchQuery({ queryKey: taskKeys.detail('30') })

    const { result } = renderHook(() => useDeleteTaskProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({ id: '30', projectId: '20' })

    await waitFor(() => {
      expect(queryClient.getQueryState(taskKeys.projectList('20'))?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(taskKeys.detail('30'))).toBeUndefined()
    })
  })
})
