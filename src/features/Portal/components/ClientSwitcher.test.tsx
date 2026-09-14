import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { makeMultiClientMembershipMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientSwitcher } from './ClientSwitcher'
import { PortalProvider } from './PortalProvider'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('ClientSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('is hidden when user has a single client membership', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <PortalProvider>
        <ClientSwitcher />
      </PortalProvider>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('shows dropdown when user has multiple client memberships', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () =>
        HttpResponse.json(makeMultiClientMembershipMeResponse()),
      ),
    )

    renderWithProviders(
      <PortalProvider>
        <ClientSwitcher />
      </PortalProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /acme corp/i })).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /acme corp/i }))

    await waitFor(() => {
      expect(screen.getByText('Beta Inc')).toBeInTheDocument()
    })
  })
})
