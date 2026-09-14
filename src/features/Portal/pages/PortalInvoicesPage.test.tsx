import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { PortalProvider } from '../components/PortalProvider'
import { PortalInvoicesPage } from './PortalInvoicesPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage() {
  return renderWithProviders(
    <PortalProvider>
      <PortalInvoicesPage />
    </PortalProvider>,
  )
}

describe('PortalInvoicesPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows empty state when there are no invoices', async () => {
    setToken('client-empty-portal-invoices')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('No invoices yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/portal/client-invoices`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders invoice rows on success', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('INV-2026-0002')).toBeInTheDocument()
      expect(screen.getByText('INV-2026-0003')).toBeInTheDocument()
    })
  })

  it('does not offer draft status in the filter', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('INV-2026-0002')).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox'))

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Sent' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Draft' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Void' })).not.toBeInTheDocument()
    })
  })
})
