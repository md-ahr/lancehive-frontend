import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { sampleTimeLogs } from '@/test/fixtures/time-logs'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { TimeLogForm } from './TimeLogForm'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

function renderForm(
  props: Partial<{
    taskId: number
    projectId: number
    timeLog: (typeof sampleTimeLogs)[0]
    onCancelEdit: () => void
    onSuccess: () => void
  }> = {},
) {
  const onSuccess = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <TimeLogForm taskId={30} projectId={20} onSuccess={onSuccess} {...props} />
    </WorkspaceProvider>,
  )
  return { onSuccess }
}

describe('TimeLogForm', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects invalid hours before submit', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /log time/i }))

    await waitFor(() => {
      expect(screen.getByText('Hours is required')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderForm()

    await userEvent.type(screen.getByLabelText('Hours'), '0')
    await userEvent.click(screen.getByRole('button', { name: /log time/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 0.01/i)).toBeInTheDocument()
    })
  })

  it('shows success toast on create', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onSuccess } = renderForm()

    await userEvent.type(screen.getByLabelText('Hours'), '1.50')
    await userEvent.type(screen.getByLabelText('Description'), 'Wireframes')
    await userEvent.click(screen.getByRole('button', { name: /log time/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Time logged')
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('updates an existing time log', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const onCancelEdit = vi.fn()
    renderForm({ timeLog: sampleTimeLogs[0], onCancelEdit })

    await userEvent.clear(screen.getByLabelText('Hours'))
    await userEvent.type(screen.getByLabelText('Hours'), '3.00')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Time log updated')
      expect(onCancelEdit).toHaveBeenCalled()
    })
  })

  it('disables submit while pending', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.post(`${API_BASE_URL}/tasks/:taskId/time-logs`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json({ id: 99 }, { status: 201 })
      }),
    )

    renderForm()

    await userEvent.type(screen.getByLabelText('Hours'), '2.00')
    await userEvent.click(screen.getByRole('button', { name: /log time/i }))

    expect(screen.getByRole('button', { name: /logging/i })).toBeDisabled()
  })

  it('disables submit when workspace is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())))

    renderForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /log time/i })).toBeDisabled()
    })
  })
})
