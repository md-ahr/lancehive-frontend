import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/test-utils'

import { ResetPasswordPage } from './ResetPasswordPage'

describe('ResetPasswordPage', () => {
  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPasswordPage />, { route: '/reset-password' })

    await user.type(screen.getByLabelText('Reset token'), 'reset-token')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('New password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'different')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows success message after valid submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPasswordPage />, { route: '/reset-password' })

    await user.type(screen.getByLabelText('Reset token'), 'reset-token')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('New password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(screen.getByText('Password updated')).toBeInTheDocument()
    })
  })
})
