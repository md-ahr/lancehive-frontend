import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/test-utils'

import { AppRoutes } from './index'

describe('AppRoutes', () => {
  it('renders public login placeholder', () => {
    renderWithProviders(<AppRoutes />, { route: '/login' })
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders app placeholder', () => {
    renderWithProviders(<AppRoutes />, { route: '/app' })
    expect(screen.getByRole('heading', { name: 'App Dashboard' })).toBeInTheDocument()
  })

  it('renders portal placeholder', () => {
    renderWithProviders(<AppRoutes />, { route: '/portal' })
    expect(screen.getByRole('heading', { name: 'Portal Dashboard' })).toBeInTheDocument()
  })

  it('renders admin placeholder', () => {
    renderWithProviders(<AppRoutes />, { route: '/admin' })
    expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument()
  })

  it('renders 404 for unknown routes', () => {
    renderWithProviders(<AppRoutes />, { route: '/does-not-exist' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
