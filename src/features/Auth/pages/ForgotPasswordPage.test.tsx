import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/test-utils'

import { ForgotPasswordPage } from './ForgotPasswordPage'

describe('ForgotPasswordPage', () => {
  it('shows success message after submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordPage />, { route: '/forgot-password' })

    await user.type(screen.getByLabelText('Email'), 'anyone@example.com')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() => {
      expect(screen.getByText('Check your email')).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        'If your email is registered, you will receive a password reset link shortly.',
      ),
    ).toBeInTheDocument()
  })
})
