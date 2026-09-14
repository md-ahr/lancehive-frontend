import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { authKeys } from '@/features/Auth/query-keys'
import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { subscriptionKeys } from '../query-keys'
import { useSwapSubscription } from './useSwapSubscription'

function useSwapSubscriptionProbe() {
  const context = useWorkspaceContext()
  const mutation = useSwapSubscription()

  return { context, mutation }
}

describe('useSwapSubscription', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('swaps subscription and invalidates queries', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: subscriptionKeys.detail() })
    await queryClient.prefetchQuery({ queryKey: authKeys.me() })

    const { result } = renderHook(() => useSwapSubscriptionProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const response = await result.current.mutation.mutateAsync({
      plan_id: 2,
      billing_interval: 'yearly',
    })

    expect(response.plan_id).toBe(2)
    expect(response.billing_interval).toBe('yearly')

    await waitFor(() => {
      expect(queryClient.getQueryState(subscriptionKeys.detail())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(authKeys.me())?.isInvalidated).toBe(true)
    })
  })
})
