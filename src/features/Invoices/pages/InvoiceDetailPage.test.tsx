import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { InvoiceDetailPage } from './InvoiceDetailPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: vi.fn(),
  },
}))

function renderPage(route = '/app/invoices/50') {
  return renderWithProviders(
    <WorkspaceProvider>
      <Routes>
        <Route path="/app/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/app/invoices" element={<div>Invoices list</div>} />
      </Routes>
    </WorkspaceProvider>,
    { route },
  )
}

describe('InvoiceDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/client-invoices/:id`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ id: 50, invoice_number: 'INV-2026-0001' })
      }),
    )

    renderPage()
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows not found when invoice is missing', async () => {
    setToken('missing-invoice-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage('/app/invoices/999')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Invoice not found' })).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/client-invoices/:id`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders draft invoice with items and balance', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'INV-2026-0001' })).toBeInTheDocument()
      expect(screen.getByText('Website development — 5h')).toBeInTheDocument()
      expect(screen.getByText('Draft')).toBeInTheDocument()
      expect(screen.getAllByText(/BDT\s*7,500\.00/).length).toBeGreaterThan(0)
    })
  })

  it('marks draft invoice as sent', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Mark as sent' })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Mark as sent' }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invoice marked as sent')
    })
  })

  it('shows record payment action for sent invoice', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage('/app/invoices/51')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Record payment' })).toBeInTheDocument()
    })
  })
})
