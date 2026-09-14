import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { InvoicesPage } from './InvoicesPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage() {
  return renderWithProviders(
    <WorkspaceProvider>
      <InvoicesPage />
    </WorkspaceProvider>,
  )
}

describe('InvoicesPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/client-invoices`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({
          data: [],
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    renderPage()
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows empty state when there are no invoices', async () => {
    setToken('empty-invoice-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('No invoices yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/client-invoices`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders invoice rows on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
      expect(screen.getByText('INV-2026-0001')).toBeInTheDocument()
      expect(screen.getByText('INV-2026-0002')).toBeInTheDocument()
      expect(screen.getByText('Draft')).toBeInTheDocument()
      expect(screen.getByText('Sent')).toBeInTheDocument()
    })
  })

  it('paginates invoices with cursor controls', async () => {
    setToken('paginated-invoice-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('INV-2026-0001')).toBeInTheDocument()
      expect(screen.queryByText('INV-2026-0004')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText('INV-2026-0004')).toBeInTheDocument()
    })
  })
})
