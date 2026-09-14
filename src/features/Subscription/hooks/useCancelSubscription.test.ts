import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { authKeys } from '@/features/Auth/query-keys'
import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { subscriptionKeys } from '../query-keys'
import { useCancelSubscription } from './useCancelSubscription'

function useCancelSubscriptionProbe() {
  const context = useWorkspaceContext()
  const mutation = useCancelSubscription()

  return { context, mutation }
}

describe('useCancelSubscription', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('cancels subscription and invalidates queries', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: subscriptionKeys.detail() })
    await queryClient.prefetchQuery({ queryKey: authKeys.me() })

    const { result } = renderHook(() => useCancelSubscriptionProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const response = await result.current.mutation.mutateAsync()

    expect(response.status).toBe('canceled')

    await waitFor(() => {
      expect(queryClient.getQueryState(subscriptionKeys.detail())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(authKeys.me())?.isInvalidated).toBe(true)
    })
  })
})
