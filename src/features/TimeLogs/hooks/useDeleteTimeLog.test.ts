import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { timeLogKeys } from '../query-keys'
import { useDeleteTimeLog } from './useDeleteTimeLog'

function useDeleteTimeLogProbe() {
  const context = useWorkspaceContext()
  const mutation = useDeleteTimeLog()

  return { context, mutation }
}

describe('useDeleteTimeLog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('deletes a time log and invalidates related queries', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: timeLogKeys.taskList('30') })

    const { result } = renderHook(() => useDeleteTimeLogProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      id: '40',
      taskId: '30',
      projectId: '20',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(timeLogKeys.taskList('30'))?.isInvalidated).toBe(true)
    })
  })
})
