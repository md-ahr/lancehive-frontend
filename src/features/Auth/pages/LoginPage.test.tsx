import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { renderWithProviders } from '@/test/test-utils'

import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders the login form', () => {
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    renderWithProviders(<LoginPage />, { route: '/login' })

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('redirects after successful login', async () => {
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(useAuthStore.getState().hasToken).toBe(true)
    })
  })
})
