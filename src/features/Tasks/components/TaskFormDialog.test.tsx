import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { sampleTasks } from '@/test/fixtures/tasks'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { TaskFormDialog } from './TaskFormDialog'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

function renderDialog(
  props: Partial<{
    task: (typeof sampleTasks)[0]
    projectId: number
    open: boolean
    onOpenChange: (open: boolean) => void
  }> = {},
) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <TaskFormDialog open projectId={20} onOpenChange={onOpenChange} {...props} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('TaskFormDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects empty title before submit', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Title'), 'Duplicate Task')
    await userEvent.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on create', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Title'), 'New Task')
    await userEvent.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Task created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('updates an existing task', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog({ task: sampleTasks[0] })

    await userEvent.clear(screen.getByLabelText('Title'))
    await userEvent.type(screen.getByLabelText('Title'), 'Updated Task')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Task updated')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('disables submit while pending', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.post(`${API_BASE_URL}/projects/:projectId/tasks`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json({ id: 99 }, { status: 201 })
      }),
    )

    renderDialog()

    await userEvent.type(screen.getByLabelText('Title'), 'Pending Task')
    await userEvent.click(screen.getByRole('button', { name: /create task/i }))

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('disables submit when workspace is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())))

    renderDialog()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create task/i })).toBeDisabled()
    })
  })
})
