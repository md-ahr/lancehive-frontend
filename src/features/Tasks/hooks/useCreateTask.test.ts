import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { taskKeys } from '../query-keys'
import { useCreateTask } from './useCreateTask'

function useCreateTaskProbe() {
  const context = useWorkspaceContext()
  const mutation = useCreateTask()

  return { context, mutation }
}

describe('useCreateTask', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a task under a project and invalidates lists', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: taskKeys.projectList('20') })

    const { result } = renderHook(() => useCreateTaskProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      projectId: '20',
      title: 'New Task',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(taskKeys.projectList('20'))?.isInvalidated).toBe(true)
    })
  })
})
