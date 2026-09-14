import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { RecordPaymentDialog } from './RecordPaymentDialog'

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
      <RecordPaymentDialog invoiceId="51" open onOpenChange={onOpenChange} />
    </WorkspaceProvider>,
  )
  return { onOpenChange }
}

describe('RecordPaymentDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('rejects empty amount', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.clear(screen.getByLabelText('Amount'))
    await userEvent.click(screen.getByRole('button', { name: /record payment/i }))

    await waitFor(() => {
      expect(screen.getByText('Amount is required')).toBeInTheDocument()
    })
  })

  it('records payment and closes dialog', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.clear(screen.getByLabelText('Amount'))
    await userEvent.type(screen.getByLabelText('Amount'), '5000')
    await userEvent.click(screen.getByRole('button', { name: /record payment/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Payment recorded')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
