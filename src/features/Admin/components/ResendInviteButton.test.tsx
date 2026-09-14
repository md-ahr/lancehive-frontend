import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { ResendInviteButton } from './ResendInviteButton'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

describe('ResendInviteButton', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('resends invite and shows success toast', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<ResendInviteButton freelancerId="6" />)

    await userEvent.click(screen.getByRole('button', { name: /resend invite/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Invitation resent')
    })
  })
})
