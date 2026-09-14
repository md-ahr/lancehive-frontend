import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { AddInvoiceItemDialog } from './AddInvoiceItemDialog'

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
      <AddInvoiceItemDialog invoiceId="50" open onOpenChange={onOpenChange} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('AddInvoiceItemDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('rejects empty description', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /add item/i }))

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })

  it('adds item and closes dialog', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Description'), 'Extra work')
    await userEvent.type(screen.getByLabelText('Quantity'), '2')
    await userEvent.type(screen.getByLabelText('Rate'), '1500')
    await userEvent.click(screen.getByRole('button', { name: /add item/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Line item added')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
