import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { UserSettingsPage } from './UserSettingsPage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('UserSettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me/settings`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ timezone: 'UTC', locale: 'en', notification_preferences: {} })
      }),
    )

    renderWithProviders(<UserSettingsPage />)
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('renders settings form on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<UserSettingsPage />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'User settings' })).toBeInTheDocument()
      expect(screen.getByLabelText('Timezone')).toHaveValue('Asia/Dhaka')
    })
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/me/settings`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<UserSettingsPage />)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('submits updated settings', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(<UserSettingsPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument()
    })

    await userEvent.clear(screen.getByLabelText('Timezone'))
    await userEvent.type(screen.getByLabelText('Timezone'), 'UTC')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('Timezone')).toHaveValue('UTC')
    })
  })
})
