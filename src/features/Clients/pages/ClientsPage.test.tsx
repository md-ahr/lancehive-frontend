import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientsPage } from './ClientsPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage() {
  return renderWithProviders(
    <WorkspaceProvider>
      <ClientsPage />
    </WorkspaceProvider>,
  )
}

describe('ClientsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients`, async () => {
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

  it('shows empty state when there are no clients', async () => {
    setToken('empty-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('No clients yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders client rows on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
      expect(screen.getByText('BigCo Ltd')).toBeInTheDocument()
      expect(screen.getByText('Acme Studio')).toBeInTheDocument()
      expect(screen.getByText('Northwind Agency')).toBeInTheDocument()
    })
  })

  it('paginates clients with cursor controls', async () => {
    setToken('paginated-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('BigCo Ltd')).toBeInTheDocument()
      expect(screen.getByText('Acme Studio')).toBeInTheDocument()
      expect(screen.queryByText('Page Two Client')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText('Page Two Client')).toBeInTheDocument()
    })
  })
})
