import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useProjectTimeSummary } from './useProjectTimeSummary'

function useProjectTimeSummaryProbe(projectId: string) {
  const context = useWorkspaceContext()
  const query = useProjectTimeSummary(projectId)

  return { context, query }
}

describe('useProjectTimeSummary', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('fetches project time summary with unbilled hours', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useProjectTimeSummaryProbe('20'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
      expect(result.current.query.data).toEqual({
        project_id: 20,
        total_hours: '6.50',
        billed_hours: '1.00',
        unbilled_hours: '5.50',
      })
    })
  })
})
