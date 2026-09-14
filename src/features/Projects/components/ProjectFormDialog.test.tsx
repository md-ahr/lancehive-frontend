import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { sampleProjects } from '@/test/fixtures/projects'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ProjectFormDialog } from './ProjectFormDialog'

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
    project: (typeof sampleProjects)[0]
    clientId: number
    open: boolean
    onOpenChange: (open: boolean) => void
  }> = {},
) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <ProjectFormDialog open onOpenChange={onOpenChange} {...props} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('ProjectFormDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects empty name before submit', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog({ clientId: 10 })

    await userEvent.click(screen.getByRole('button', { name: /create project/i }))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('shows client selector on global create', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await waitFor(() => {
      expect(screen.getByLabelText('Client')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog({ clientId: 10 })

    await userEvent.type(screen.getByLabelText('Name'), 'Duplicate Project')
    await userEvent.type(screen.getByLabelText('Hourly rate'), '1500.00')
    await userEvent.click(screen.getByRole('button', { name: /create project/i }))

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on create', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog({ clientId: 10 })

    await userEvent.type(screen.getByLabelText('Name'), 'New Project')
    await userEvent.type(screen.getByLabelText('Hourly rate'), '1500.00')
    await userEvent.click(screen.getByRole('button', { name: /create project/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Project created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('updates an existing project', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog({ project: sampleProjects[0] })

    await userEvent.clear(screen.getByLabelText('Name'))
    await userEvent.type(screen.getByLabelText('Name'), 'Updated Project')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Project updated')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('disables submit while pending', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.post(`${API_BASE_URL}/clients/:clientId/projects`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json({ id: 99 }, { status: 201 })
      }),
    )

    renderDialog({ clientId: 10 })

    await userEvent.type(screen.getByLabelText('Name'), 'Pending Project')
    await userEvent.type(screen.getByLabelText('Hourly rate'), '1500.00')
    await userEvent.click(screen.getByRole('button', { name: /create project/i }))

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('disables submit when workspace is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())))

    renderDialog({ clientId: 10 })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create project/i })).toBeDisabled()
    })
  })
})
