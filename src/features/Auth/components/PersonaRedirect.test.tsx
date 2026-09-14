import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { setToken } from '@/lib/auth-storage'
import { makeMeResponse } from '@/test/fixtures/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { useAuthStore } from '../stores/useAuthStore'
import { PersonaRedirect } from './PersonaRedirect'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('PersonaRedirect', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it.each([
    ['freelancer', '/app', 'App Dashboard'],
    ['client', '/portal', 'Portal Dashboard'],
    ['super_admin', '/admin', 'Admin Dashboard'],
  ] as const)('redirects %s to %s', async (role, _path, heading) => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(http.get(`${API_BASE_URL}/me`, () => HttpResponse.json(makeMeResponse(role))))

    renderWithProviders(
      <Routes>
        <Route path="/" element={<PersonaRedirect />} />
        <Route path="/app" element={<h1>App Dashboard</h1>} />
        <Route path="/portal" element={<h1>Portal Dashboard</h1>} />
        <Route path="/admin" element={<h1>Admin Dashboard</h1>} />
      </Routes>,
      { route: '/' },
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    })
  })
})
