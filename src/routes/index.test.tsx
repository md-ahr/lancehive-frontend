import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { renderWithProviders } from '@/test/test-utils'

import { AppRoutes } from './index'

describe('AppRoutes', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('renders login page', () => {
    renderWithProviders(<AppRoutes />, { route: '/login' })
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders forgot password page', () => {
    renderWithProviders(<AppRoutes />, { route: '/forgot-password' })
    expect(screen.getByRole('heading', { name: 'Forgot password' })).toBeInTheDocument()
  })

  it('renders reset password page', () => {
    renderWithProviders(<AppRoutes />, { route: '/reset-password' })
    expect(screen.getByRole('heading', { name: 'Reset password' })).toBeInTheDocument()
  })

  it('redirects unauthenticated app access to login', async () => {
    renderWithProviders(<AppRoutes />, { route: '/app' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    })
  })

  it('renders 404 for unknown routes', () => {
    renderWithProviders(<AppRoutes />, { route: '/does-not-exist' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
