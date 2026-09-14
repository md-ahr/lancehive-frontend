import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientMembersTab } from './ClientMembersTab'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderTab() {
  return renderWithProviders(
    <WorkspaceProvider>
      <ClientMembersTab clientId={10} />
    </WorkspaceProvider>,
  )
}

describe('ClientMembersTab', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/members`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({
          data: [],
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    renderTab()
    expect(screen.getByTestId('loading-skeleton-table')).toBeInTheDocument()
  })

  it('shows empty state when there are no portal members', async () => {
    setToken('empty-portal-members')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('No portal members yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/members`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderTab()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders portal member rows on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Sam Primary')).toBeInTheDocument()
      expect(screen.getByText('Taylor Member')).toBeInTheDocument()
      expect(screen.getByText('Jordan Viewer')).toBeInTheDocument()
    })
  })

  it('paginates portal members with cursor controls', async () => {
    setToken('paginated-portal-members')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Sam Primary')).toBeInTheDocument()
      expect(screen.getByText('Taylor Member')).toBeInTheDocument()
      expect(screen.queryByText('Page Two Contact')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText('Page Two Contact')).toBeInTheDocument()
    })
  })

  it('opens invite dialog from invite button', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Sam Primary')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /invite member/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /invite portal member/i })).toBeInTheDocument()
    })
  })
})
