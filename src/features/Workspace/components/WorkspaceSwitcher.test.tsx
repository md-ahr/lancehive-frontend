import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { makeMultiMembershipMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from './WorkspaceProvider'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('WorkspaceSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('is hidden when user has a single membership', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <WorkspaceProvider>
        <WorkspaceSwitcher />
      </WorkspaceProvider>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('shows dropdown when user has multiple memberships', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMultiMembershipMeResponse())),
    )

    renderWithProviders(
      <WorkspaceProvider>
        <WorkspaceSwitcher />
      </WorkspaceProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /jane studio/i })).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /jane studio/i }))

    await waitFor(() => {
      expect(screen.getByText('Second Studio')).toBeInTheDocument()
    })
  })
})
