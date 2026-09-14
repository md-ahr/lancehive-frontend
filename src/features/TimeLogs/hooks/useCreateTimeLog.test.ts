import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { timeLogKeys } from '../query-keys'
import { useCreateTimeLog } from './useCreateTimeLog'

function useCreateTimeLogProbe() {
  const context = useWorkspaceContext()
  const mutation = useCreateTimeLog()

  return { context, mutation }
}

describe('useCreateTimeLog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('creates a time log and invalidates related queries', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: timeLogKeys.taskList('30') })
    await queryClient.prefetchQuery({ queryKey: timeLogKeys.projectSummary('20') })

    const { result } = renderHook(() => useCreateTimeLogProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      taskId: '30',
      projectId: '20',
      hours: '1.50',
      logged_at: '2026-03-10T09:00:00+00:00',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(timeLogKeys.taskList('30'))?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(timeLogKeys.projectSummary('20'))?.isInvalidated).toBe(true)
    })
  })
})
