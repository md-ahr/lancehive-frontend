import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { makeMemberRoleMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { WorkspaceSettingsPage } from './WorkspaceSettingsPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderPage() {
  return renderWithProviders(
    <WorkspaceProvider>
      <WorkspaceSettingsPage />
    </WorkspaceProvider>,
  )
}

describe('WorkspaceSettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders workspace settings form for owners', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Workspace settings' })).toBeInTheDocument()
      expect(screen.getByLabelText('Business name')).toHaveValue('Jane Studio')
    })
  })

  it('shows view-only message for members', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMemberRoleMeResponse())))

    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/only workspace owners and admins/i)).toBeInTheDocument()
    })
  })

  it('handles 403 on fetch', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/workspace/settings`, () =>
        HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 }),
      ),
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Access denied')).toBeInTheDocument()
    })
  })
})
