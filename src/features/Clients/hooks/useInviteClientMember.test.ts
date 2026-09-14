import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { clientMemberKeys } from '../query-keys'
import { useInviteClientMember } from './useInviteClientMember'

function useInviteClientMemberProbe() {
  const context = useWorkspaceContext()
  const mutation = useInviteClientMember()

  return { context, mutation }
}

describe('useInviteClientMember', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('invites a client member and invalidates client member list', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: clientMemberKeys.list('10') })

    const { result } = renderHook(() => useInviteClientMemberProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({
      clientId: '10',
      name: 'New Contact',
      email: 'new@bigco.com',
      role: 'member',
    })

    await waitFor(() => {
      expect(queryClient.getQueryState(clientMemberKeys.list('10'))?.isInvalidated).toBe(true)
    })
  })
})
