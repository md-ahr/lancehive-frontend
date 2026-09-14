import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientProjectsTab } from './ClientProjectsTab'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderTab(clientId = 10) {
  return renderWithProviders(
    <WorkspaceProvider>
      <ClientProjectsTab clientId={clientId} />
    </WorkspaceProvider>,
  )
}

describe('ClientProjectsTab', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/projects`, async () => {
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

  it('shows empty state when there are no projects', async () => {
    setToken('empty-project-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab(999)

    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:clientId/projects`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderTab()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders client projects on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument()
      expect(screen.getByText('Mobile App')).toBeInTheDocument()
      expect(screen.queryByText('Brand Refresh')).not.toBeInTheDocument()
    })
  })

  it('opens create dialog from tab action', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /create project/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create project' })).toBeInTheDocument()
      expect(screen.queryByLabelText('Client')).not.toBeInTheDocument()
    })
  })
})
