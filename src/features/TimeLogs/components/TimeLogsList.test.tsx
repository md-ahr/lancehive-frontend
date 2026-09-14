import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { TimeLogsList } from './TimeLogsList'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderList(taskId = 30, projectId = 20) {
  const onEdit = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <TimeLogsList taskId={taskId} projectId={projectId} onEdit={onEdit} />
    </WorkspaceProvider>,
  )
  return { onEdit }
}

describe('TimeLogsList', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/tasks/:taskId/time-logs`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({
          data: [],
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    renderList()
    expect(screen.getByTestId('loading-skeleton-table')).toBeInTheDocument()
  })

  it('shows empty state when there are no time logs', async () => {
    setToken('empty-time-log-list')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderList(999)

    await waitFor(() => {
      expect(screen.getByText('No time logged yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/tasks/:taskId/time-logs`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderList()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders time logs on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderList()

    await waitFor(() => {
      expect(screen.getByText('Initial wireframes')).toBeInTheDocument()
      expect(screen.getByText('Review meeting')).toBeInTheDocument()
      expect(screen.getByText('Billed')).toBeInTheDocument()
      expect(screen.getByText('Unbilled')).toBeInTheDocument()
    })
  })

  it('calls onEdit when edit is clicked', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onEdit } = renderList()

    await waitFor(() => {
      expect(screen.getByText('Initial wireframes')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /edit time log/i }))

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 40, description: 'Initial wireframes' }),
    )
  })
})
