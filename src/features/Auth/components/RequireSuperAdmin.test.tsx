import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { makeMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { RequireSuperAdmin } from './RequireSuperAdmin'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('RequireSuperAdmin', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders child routes for super admin users', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('Admin area')).toBeInTheDocument()
    })
  })

  it('redirects freelancer users to app routes', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
        <Route path="/app" element={<div>App area</div>} />
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('App area')).toBeInTheDocument()
    })
  })

  it('redirects client users to portal routes', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
        <Route path="/portal" element={<div>Portal area</div>} />
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('Portal area')).toBeInTheDocument()
    })
  })

  it('redirects unauthenticated users to login', async () => {
    renderWithProviders(
      <Routes>
        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('Login page')).toBeInTheDocument()
    })
  })

  it('redirects non-super-admin role to app', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () =>
        HttpResponse.json({
          ...makeMeResponse('freelancer'),
          user: { ...makeMeResponse('freelancer').user, role: 'freelancer' },
        }),
      ),
    )

    renderWithProviders(
      <Routes>
        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
        <Route path="/app" element={<div>App area</div>} />
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('App area')).toBeInTheDocument()
    })
  })
})
