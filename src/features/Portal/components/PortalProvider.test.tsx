import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { setClientId } from '@/lib/client-storage'
import { renderWithProviders } from '@/test/test-utils'

import { usePortalContext } from '../hooks/usePortalContext'
import { PortalProvider } from './PortalProvider'

function ContextProbe() {
  const { clientId } = usePortalContext()
  return <div data-testid="client-id">{clientId}</div>
}

describe('PortalProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('provides clientId from active client', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <PortalProvider>
        <ContextProbe />
      </PortalProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('client-id')).toHaveTextContent('10')
    })
  })

  it('restores persisted client selection', async () => {
    setToken('client-token')
    setClientId('10')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <PortalProvider>
        <ContextProbe />
      </PortalProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('client-id')).toHaveTextContent('10')
    })
  })
})
