import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/test-utils'

import { TimeSummaryCard } from './TimeSummaryCard'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function renderCard(projectId = 20) {
  return renderWithProviders(
    <WorkspaceProvider>
      <TimeSummaryCard projectId={projectId} />
    </WorkspaceProvider>,
  )
}

describe('TimeSummaryCard', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('shows loading skeleton initially', () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/time-summary`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({ project_id: 20, total_hours: '0.00' })
      }),
    )

    renderCard()
    expect(screen.getByTestId('loading-skeleton-card')).toBeInTheDocument()
  })

  it('shows error state on failure', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/projects/:projectId/time-summary`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderCard()

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('displays project time summary on success', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderCard()

    await waitFor(() => {
      expect(screen.getByText('Total hours')).toBeInTheDocument()
      expect(screen.getByText('6.50h')).toBeInTheDocument()
      expect(screen.getByText('Billed hours')).toBeInTheDocument()
      expect(screen.getByText('1.00h')).toBeInTheDocument()
      expect(screen.getByText('Unbilled hours')).toBeInTheDocument()
      expect(screen.getByText('5.50h')).toBeInTheDocument()
    })
  })
})
