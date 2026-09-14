import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { CreateFreelancerDialog } from './CreateFreelancerDialog'

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
  renderWithProviders(<CreateFreelancerDialog open={open} onOpenChange={onOpenChange} />)
  return { onOpenChange }
}

describe('CreateFreelancerDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('rejects invalid email before submit', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Workspace name'), 'New Studio')
    await userEvent.type(screen.getByLabelText('Owner name'), 'Owner')
    await userEvent.type(screen.getByLabelText('Owner email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /create workspace/i }))

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
    })
  })

  it('maps 422 validation errors to form fields', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Workspace name'), 'Duplicate Studio')
    await userEvent.type(screen.getByLabelText('Owner name'), 'Duplicate Owner')
    await userEvent.type(screen.getByLabelText('Owner email'), 'duplicate@studio.test')
    await userEvent.click(screen.getByRole('button', { name: /create workspace/i }))

    await waitFor(() => {
      expect(screen.getByText(/already been taken/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on create', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Workspace name'), 'New Studio')
    await userEvent.type(screen.getByLabelText('Owner name'), 'New Owner')
    await userEvent.type(screen.getByLabelText('Owner email'), 'owner@newstudio.test')
    await userEvent.click(screen.getByRole('button', { name: /create workspace/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Workspace created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
