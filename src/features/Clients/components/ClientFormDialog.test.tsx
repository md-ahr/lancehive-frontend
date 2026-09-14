import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { sampleClients } from '@/test/fixtures/clients'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientFormDialog } from './ClientFormDialog'

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
    client: (typeof sampleClients)[0]
    open: boolean
    onOpenChange: (open: boolean) => void
  }> = {},
) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <ClientFormDialog open onOpenChange={onOpenChange} {...props} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('ClientFormDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects empty name before submit', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /create client/i }))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Duplicate Client')
    await userEvent.click(screen.getByRole('button', { name: /create client/i }))

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on create', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'New Client')
    await userEvent.type(screen.getByLabelText('Contact email'), 'new@client.test')
    await userEvent.click(screen.getByRole('button', { name: /create client/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Client created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('updates an existing client', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog({ client: sampleClients[0] })

    await userEvent.clear(screen.getByLabelText('Name'))
    await userEvent.type(screen.getByLabelText('Name'), 'Updated BigCo')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Client updated')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('disables submit while pending', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.post(`${API_BASE_URL}/clients`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json({ id: 99 }, { status: 201 })
      }),
    )

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Pending Client')
    await userEvent.click(screen.getByRole('button', { name: /create client/i }))

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('disables submit when workspace is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())))

    renderDialog()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create client/i })).toBeDisabled()
    })
  })
})
