import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { checkoutResponse } from '@/test/fixtures/subscription'
import { createWrapper } from '@/test/test-utils'

import { useCheckoutSubscription } from './useCheckoutSubscription'

function useCheckoutSubscriptionProbe() {
  const context = useWorkspaceContext()
  const mutation = useCheckoutSubscription()

  return { context, mutation }
}

describe('useCheckoutSubscription', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns checkout url on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useCheckoutSubscriptionProbe(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const response = await result.current.mutation.mutateAsync({
      plan_id: 1,
      billing_interval: 'monthly',
    })

    expect(response.checkout_url).toBe(checkoutResponse.checkout_url)
  })
})
