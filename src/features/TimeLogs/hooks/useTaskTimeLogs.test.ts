import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useTaskTimeLogs } from './useTaskTimeLogs'

function useTaskTimeLogsProbe(taskId: string) {
  const context = useWorkspaceContext()
  const query = useTaskTimeLogs({ taskId })

  return { context, query }
}

describe('useTaskTimeLogs', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('fetches time logs for a task', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useTaskTimeLogsProbe('30'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
      expect(result.current.query.data?.data).toHaveLength(2)
      expect(result.current.query.data?.data[0]?.hours).toBe('2.50')
    })
  })
})
