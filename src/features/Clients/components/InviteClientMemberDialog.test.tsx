import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { InviteClientMemberDialog } from './InviteClientMemberDialog'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

function renderDialog(open = true) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <InviteClientMemberDialog clientId={10} open={open} onOpenChange={onOpenChange} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('InviteClientMemberDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects invalid email before submit', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'New Contact')
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /send invitation/i }))

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Duplicate User')
    await userEvent.type(screen.getByLabelText('Email'), 'duplicate@bigco.com')
    await userEvent.click(screen.getByRole('button', { name: /send invitation/i }))

    await waitFor(() => {
      expect(screen.getByText(/already has access/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on invite', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'New Contact')
    await userEvent.type(screen.getByLabelText('Email'), 'new@bigco.com')
    await userEvent.click(screen.getByRole('button', { name: /send invitation/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Portal invitation sent')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('disables submit while pending', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.post(`${API_BASE_URL}/clients/:clientId/members`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json({ id: 99 }, { status: 201 })
      }),
    )

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Pending Contact')
    await userEvent.type(screen.getByLabelText('Email'), 'pending@bigco.com')
    await userEvent.click(screen.getByRole('button', { name: /send invitation/i }))

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('shows toast on 403 forbidden', async () => {
    setToken('member-only')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Blocked Contact')
    await userEvent.type(screen.getByLabelText('Email'), 'blocked@bigco.com')
    await userEvent.click(screen.getByRole('button', { name: /send invitation/i }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("You don't have permission to do that.")
    })
  })
})
