import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { AdminLayout } from './AdminLayout'

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders sidebar navigation and child route', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin dashboard content</div>} />
        </Route>
      </Routes>,
      { route: '/admin' },
    )

    await waitFor(() => {
      expect(screen.getByText('Admin dashboard content')).toBeInTheDocument()
      expect(screen.getByText('Freelancers')).toBeInTheDocument()
      expect(screen.getByText('Plans')).toBeInTheDocument()
    })
  })
})
