import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { useAuthStore } from '../stores/useAuthStore'
import { RequireAuth } from './RequireAuth'

function ProtectedApp() {
  return <h1>Protected content</h1>
}

describe('RequireAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('redirects to login when unauthenticated', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<h1>Login page</h1>} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<ProtectedApp />} />
        </Route>
      </Routes>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument()
    })
  })

  it('renders protected content when authenticated', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<ProtectedApp />} />
        </Route>
      </Routes>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Protected content' })).toBeInTheDocument()
    })
  })
})
