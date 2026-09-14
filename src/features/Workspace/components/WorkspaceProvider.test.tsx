import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { setFreelancerId } from '@/lib/workspace-storage'
import { renderWithProviders } from '@/test/test-utils'

import { useWorkspaceContext } from '../hooks/useWorkspaceContext'
import { WorkspaceProvider } from './WorkspaceProvider'

function ContextProbe() {
  const { freelancerId } = useWorkspaceContext()
  return <div data-testid="freelancer-id">{freelancerId}</div>
}

describe('WorkspaceProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('provides freelancerId from active workspace', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <WorkspaceProvider>
        <ContextProbe />
      </WorkspaceProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('freelancer-id')).toHaveTextContent('42')
    })
  })

  it('restores persisted freelancer selection', async () => {
    setToken('test-token')
    setFreelancerId('42')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderWithProviders(
      <WorkspaceProvider>
        <ContextProbe />
      </WorkspaceProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('freelancer-id')).toHaveTextContent('42')
    })
  })
})
