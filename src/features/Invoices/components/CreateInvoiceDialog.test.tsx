import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { CreateInvoiceDialog } from './CreateInvoiceDialog'

const toastSuccess = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: vi.fn(),
  },
}))

function renderDialog() {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <CreateInvoiceDialog projectId="20" open onOpenChange={onOpenChange} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('CreateInvoiceDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('shows prefill toggle defaulting to yes', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    expect(screen.getByLabelText('Prefill from unbilled time')).toBeInTheDocument()
    expect(screen.getByText('yes')).toBeInTheDocument()
  })

  it('creates invoice and closes dialog', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /create invoice/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invoice created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
