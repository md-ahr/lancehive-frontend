import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { PortalLayout } from './PortalLayout'
import { PortalProvider } from './PortalProvider'

describe('PortalLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders top navigation and child route without write actions', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <PortalProvider>
        <Routes>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<div>Portal content</div>} />
          </Route>
        </Routes>
      </PortalProvider>,
      { route: '/portal' },
    )

    await waitFor(() => {
      expect(screen.getByText('Portal content')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Invoices')).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: /add|create|invite|edit|delete/i })).toBeNull()
  })
})
