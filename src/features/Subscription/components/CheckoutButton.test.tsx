import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { starterPlan } from '@/test/fixtures/subscription'
import { renderWithProviders } from '@/test/test-utils'

import * as redirectModule from '../lib/redirect-to-checkout'
import { CheckoutButton } from './CheckoutButton'

describe('CheckoutButton', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    vi.restoreAllMocks()
  })

  it('redirects to checkout url on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const redirectSpy = vi.spyOn(redirectModule, 'redirectToCheckout').mockImplementation(() => {})

    renderWithProviders(
      <WorkspaceProvider>
        <CheckoutButton plan={starterPlan} />
      </WorkspaceProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Continue to checkout' }))

    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledWith('https://checkout.stripe.com/test-session')
    })
  })
})
