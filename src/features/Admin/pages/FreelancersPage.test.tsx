import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { FreelancersPage } from './FreelancersPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: vi.fn(),
  },
}))

describe('FreelancersPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('shows loading skeleton initially', () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/admin/freelancers`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ data: [], meta: { per_page: 25 }, links: {} })
      }),
    )

    renderWithProviders(<FreelancersPage />)
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows empty state when there are no freelancers', async () => {
    setToken('admin-token empty-freelancers')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<FreelancersPage />)

    await waitFor(() => {
      expect(screen.getByText('No workspaces yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/admin/freelancers`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<FreelancersPage />)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders freelancer rows on success', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<FreelancersPage />)

    await waitFor(() => {
      expect(screen.getByText('Acme Studio')).toBeInTheDocument()
      expect(screen.getByText('Beta Creative')).toBeInTheDocument()
    })
  })

  it('creates a workspace through the dialog', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<FreelancersPage />)

    await waitFor(() => {
      expect(screen.getByText('Acme Studio')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /create workspace/i }))
    await userEvent.type(screen.getByLabelText('Workspace name'), 'Gamma Studio')
    await userEvent.type(screen.getByLabelText('Owner name'), 'Gamma Owner')
    await userEvent.type(screen.getByLabelText('Owner email'), 'gamma@studio.test')
    await userEvent.click(screen.getByRole('button', { name: /create workspace/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Workspace created')
    })
  })

  it('resends invite for pending freelancers', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<FreelancersPage />)

    await waitFor(() => {
      expect(screen.getByText('Beta Creative')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /resend invite/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invitation resent')
    })
  })
})
