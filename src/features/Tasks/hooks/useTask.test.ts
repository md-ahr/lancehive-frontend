import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { sampleTasks } from '@/test/fixtures/tasks'
import { createWrapper } from '@/test/test-utils'

import { useTask } from './useTask'

describe('useTask', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns a task by id', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useTask('30'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(sampleTasks[0])
  })

  it('surfaces error on 404', async () => {
    setToken('missing-task-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useTask('30'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
