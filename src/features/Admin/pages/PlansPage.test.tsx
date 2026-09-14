import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { PlansPage } from './PlansPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

const toastSuccess = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: vi.fn(),
  },
}))

describe('PlansPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
  })

  it('shows loading skeleton initially', () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/admin/plans`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ data: [] })
      }),
    )

    renderWithProviders(<PlansPage />)
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows empty state when there are no plans', async () => {
    setToken('admin-token empty-plans')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<PlansPage />)

    await waitFor(() => {
      expect(screen.getByText('No plans yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/admin/plans`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<PlansPage />)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders plan rows on success', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<PlansPage />)

    await waitFor(() => {
      expect(screen.getByText('Starter')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()
    })
  })

  it('creates a plan through the dialog', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<PlansPage />)

    await waitFor(() => {
      expect(screen.getByText('Starter')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /create plan/i }))
    await userEvent.type(screen.getByLabelText('Name'), 'Enterprise')
    await userEvent.type(screen.getByLabelText('Slug'), 'enterprise')
    await userEvent.click(screen.getByRole('button', { name: /create plan/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Plan created')
    })
  })
})
