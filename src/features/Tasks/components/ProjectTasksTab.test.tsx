import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ProjectTasksTab } from './ProjectTasksTab'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderTab(projectId = 20) {
  return renderWithProviders(
    <WorkspaceProvider>
      <ProjectTasksTab projectId={projectId} />
    </WorkspaceProvider>,
  )
}

describe('ProjectTasksTab', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/tasks`, async () => {
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

  it('shows empty state when there are no tasks', async () => {
    setToken('empty-task-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab(999)

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/tasks`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderTab()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders project tasks on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Homepage mockup')).toBeInTheDocument()
      expect(screen.getByText('Navigation polish')).toBeInTheDocument()
    })
  })

  it('opens create dialog from tab action', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Homepage mockup')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument()
    })
  })

  it('opens task detail sheet on row click', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderTab()

    await waitFor(() => {
      expect(screen.getByText('Homepage mockup')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Homepage mockup'))

    await waitFor(() => {
      expect(screen.getByText('Time entries for this task will appear here.')).toBeInTheDocument()
    })
  })
})
