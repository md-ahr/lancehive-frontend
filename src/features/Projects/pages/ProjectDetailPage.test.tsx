import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { ProjectDetailPage } from './ProjectDetailPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage(route = '/app/projects/20') {
  return renderWithProviders(
    <WorkspaceProvider>
      <Routes>
        <Route path="/app/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </WorkspaceProvider>,
    { route },
  )
}

describe('ProjectDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:id`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ id: 20, name: 'Website Redesign' })
      }),
    )

    renderPage()
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('shows not found when project is missing', async () => {
    setToken('missing-project-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Project not found' })).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:id`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('renders project header and tabs on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument()
      expect(screen.getByText('BigCo Ltd')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Tasks' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Time' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Invoices' })).toBeInTheDocument()
      expect(screen.getByText('Tasks for this project will appear here.')).toBeInTheDocument()
    })
  })
})
