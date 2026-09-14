import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { PortalProvider } from '../components/PortalProvider'
import { PortalProjectsPage } from './PortalProjectsPage'

function renderPage() {
  return renderWithProviders(
    <PortalProvider>
      <PortalProjectsPage />
    </PortalProvider>,
  )
}

describe('PortalProjectsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows empty state when there are no projects', async () => {
    setToken('client-empty-portal-projects')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

    server.use(
      http.get(`${API_BASE_URL}/portal/projects`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders project rows on success', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument()
      expect(screen.getByText('Mobile App')).toBeInTheDocument()
    })
  })
})
