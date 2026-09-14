import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeMemberRoleMeResponse, makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { activeSubscription, readOnlySubscription } from '@/test/fixtures/subscription'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { SubscriptionPage } from './SubscriptionPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage() {
  return renderWithProviders(
    <WorkspaceProvider>
      <SubscriptionPage />
    </WorkspaceProvider>,
  )
}

describe('SubscriptionPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders plan status for workspace owners', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Subscription' })).toBeInTheDocument()
      expect(screen.getByText('Starter')).toBeInTheDocument()
      expect(screen.getByText('Trialing')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue to checkout' })).toBeInTheDocument()
    })
  })

  it('shows view-only message for members', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMemberRoleMeResponse())))

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/only workspace owners/i)).toBeInTheDocument()
    })
  })

  it('shows checkout for read-only subscriptions', async () => {
    setToken('read-only-subscription')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())),
      http.get(`${API_BASE_URL}/subscription`, () => HttpResponse.json(readOnlySubscription)),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Read Only')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue to checkout' })).toBeInTheDocument()
    })
  })

  it('shows cancel action for active subscriptions', async () => {
    setToken('active-subscription')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/subscription`, () => HttpResponse.json(activeSubscription)),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel subscription' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Continue to checkout' })).not.toBeInTheDocument()
    })
  })

  it('handles fetch error with retry', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/subscription`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    })
  })
})
