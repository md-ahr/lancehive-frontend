import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { memberKeys } from '../query-keys'
import { useInviteMember } from './useInviteMember'

function useInviteMemberProbe() {
  const context = useWorkspaceContext()
  const mutation = useInviteMember()

  return { context, mutation }
}

describe('useInviteMember', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('invites a member and invalidates member list', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: memberKeys.list() })

    const { result } = renderHook(() => useInviteMemberProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      name: 'New Member',
      email: 'new@studio.test',
      role: 'member',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(memberKeys.list())?.isInvalidated).toBe(true)
    })
  })
})
