import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { renderWithProviders } from '@/test/test-utils'

import { UserMenu } from './UserMenu'

describe('UserMenu', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows settings link and signs out', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<UserMenu />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /test user/i })).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /test user/i }))

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Sign out'))

    await waitFor(() => {
      expect(useAuthStore.getState().hasToken).toBe(false)
    })
  })
})
