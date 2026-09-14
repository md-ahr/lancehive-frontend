import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { TaskDetailSheet } from './TaskDetailSheet'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderSheet(
  props: Partial<{
    taskId: number | null
    projectId: number
    open: boolean
    onOpenChange: (open: boolean) => void
  }> = {},
) {
  const onOpenChange = vi.fn()
  return renderWithProviders(
    <WorkspaceProvider>
      <TaskDetailSheet taskId={30} projectId={20} open onOpenChange={onOpenChange} {...props} />
    </WorkspaceProvider>,
  )
}

describe('TaskDetailSheet', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/tasks/:id`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ id: 30, title: 'Homepage mockup' })
      }),
    )

    renderSheet()
    expect(screen.getByTestId('loading-skeleton-card')).toBeInTheDocument()
  })

  it('shows not found when task is missing', async () => {
    setToken('missing-task-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderSheet()

    await waitFor(() => {
      expect(screen.getByText('Task not found')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/tasks/:id`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderSheet()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders task details and time log placeholder on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderSheet()

    await waitFor(() => {
      expect(screen.getByText('Homepage mockup')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Time entries for this task will appear here.')).toBeInTheDocument()
    })
  })
})
