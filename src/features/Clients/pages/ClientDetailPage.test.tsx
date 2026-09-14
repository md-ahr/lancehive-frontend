import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ClientDetailPage } from './ClientDetailPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage(route = '/app/clients/10') {
  return renderWithProviders(
    <WorkspaceProvider>
      <Routes>
        <Route path="/app/clients/:id" element={<ClientDetailPage />} />
      </Routes>
    </WorkspaceProvider>,
    { route },
  )
}

describe('ClientDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:id`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ id: 10, name: 'BigCo Ltd' })
      }),
    )

    renderPage()
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows not found when client is missing', async () => {
    setToken('missing-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Client not found' })).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/clients/:id`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders client header and tabs on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'BigCo Ltd' })).toBeInTheDocument()
      expect(screen.getByText('billing@bigco.com')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Projects' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Members' })).toBeInTheDocument()
      expect(screen.getByText('Projects for this client will appear here.')).toBeInTheDocument()
    })
  })
})
