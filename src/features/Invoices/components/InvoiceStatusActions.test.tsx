import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { sampleDraftInvoiceDetail } from '@/test/fixtures/invoices'
import { renderWithProviders } from '@/test/test-utils'

import { InvoiceStatusActions } from './InvoiceStatusActions'

const toastSuccess = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: vi.fn(),
  },
}))

function renderActions() {
  const onAddItem = vi.fn()
  const onRecordPayment = vi.fn()

  renderWithProviders(
    <WorkspaceProvider>
      <Routes>
        <Route
          path="/"
          element={
            <InvoiceStatusActions
              invoice={sampleDraftInvoiceDetail}
              onAddItem={onAddItem}
              onRecordPayment={onRecordPayment}
            />
          }
        />
        <Route path="/app/invoices" element={<div>Invoices list</div>} />
      </Routes>
    </WorkspaceProvider>,
    { route: '/' },
  )

  return { onAddItem, onRecordPayment }
}

describe('InvoiceStatusActions', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('marks draft invoice as sent', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderActions()

    await userEvent.click(screen.getByRole('button', { name: 'Mark as sent' }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invoice marked as sent')
    })
  })

  it('confirms void before deleting draft', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderActions()

    await userEvent.click(screen.getByRole('button', { name: 'Void draft' }))

    await waitFor(() => {
      expect(screen.getByText('Void draft invoice?')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Void invoice' }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invoice voided')
      expect(screen.getByText('Invoices list')).toBeInTheDocument()
    })
  })
})
