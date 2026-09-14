import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'

import { setToken } from '@/lib/auth-storage'
import { makeReadOnlyMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { AppLayout } from './AppLayout'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders sidebar navigation and child route', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <WorkspaceProvider>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </WorkspaceProvider>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard content')).toBeInTheDocument()
      expect(screen.getByText('Clients')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  it('shows read-only banner when subscription is read-only', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeReadOnlyMeResponse())))

    renderWithProviders(
      <WorkspaceProvider>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </WorkspaceProvider>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByText('Workspace is read-only')).toBeInTheDocument()
    })
  })
})
