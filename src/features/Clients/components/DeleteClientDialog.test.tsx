import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'
import { setToken } from '@/lib/auth-storage'
import { sampleClients } from '@/test/fixtures/clients'
import { renderWithProviders } from '@/test/test-utils'

import { DeleteClientDialog } from './DeleteClientDialog'

import type * as ReactRouterDom from 'react-router-dom'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

const navigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

function renderDialog(open = true) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <WorkspaceProvider>
      <DeleteClientDialog client={sampleClients[0]} open={open} onOpenChange={onOpenChange} />
    </WorkspaceProvider>,
    { route: '/app/clients/10' },
  )
  return { onOpenChange }
}

describe('DeleteClientDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
    navigate.mockReset()
  })

  it('archives a client and navigates back to the list', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /archive client/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Client archived')
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(navigate).toHaveBeenCalledWith('/app/clients')
    })
  })
})
