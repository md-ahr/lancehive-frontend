import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
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

  it('renders app dashboard for authenticated freelancer', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<AppRoutes />, { route: '/app' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    })
  })

  it('loads clients page route', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<AppRoutes />, { route: '/app/clients' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
    })
  })

  it('loads client detail route', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<AppRoutes />, { route: '/app/clients/10' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'BigCo Ltd' })).toBeInTheDocument()
    })
  })

  it('loads members page route', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<AppRoutes />, { route: '/app/members' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    })
  })

  it('navigates to user settings from app shell', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<AppRoutes />, { route: '/app' })

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    await userEvent.click(screen.getAllByText('Settings')[0])

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'User settings' })).toBeInTheDocument()
    })
  })

  it('renders 404 for unknown routes', () => {
    renderWithProviders(<AppRoutes />, { route: '/does-not-exist' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
