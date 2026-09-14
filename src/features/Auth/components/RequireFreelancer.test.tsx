import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'

import { setToken } from '@/lib/auth-storage'
import { makeMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { RequireFreelancer } from './RequireFreelancer'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('RequireFreelancer', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders child routes for freelancer users', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route element={<RequireFreelancer />}>
          <Route path="/app" element={<div>Freelancer area</div>} />
        </Route>
      </Routes>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByText('Freelancer area')).toBeInTheDocument()
    })
  })

  it('redirects super admin to admin routes', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMeResponse('super_admin'))),
    )

    renderWithProviders(
      <Routes>
        <Route element={<RequireFreelancer />}>
          <Route path="/app" element={<div>Freelancer area</div>} />
        </Route>
        <Route path="/admin" element={<div>Admin area</div>} />
      </Routes>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByText('Admin area')).toBeInTheDocument()
    })
  })

  it('redirects client users to portal routes', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMeResponse('client'))))

    renderWithProviders(
      <Routes>
        <Route element={<RequireFreelancer />}>
          <Route path="/app" element={<div>Freelancer area</div>} />
        </Route>
        <Route path="/portal" element={<div>Portal area</div>} />
      </Routes>,
      { route: '/app' },
    )

    await waitFor(() => {
      expect(screen.getByText('Portal area')).toBeInTheDocument()
    })
  })
})
