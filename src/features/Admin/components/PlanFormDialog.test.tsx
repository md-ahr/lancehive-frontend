import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { starterPlan } from '@/test/fixtures/subscription'
import { renderWithProviders } from '@/test/test-utils'

import { PlanFormDialog } from './PlanFormDialog'

const toastSuccess = vi.fn()
const toastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}))

function renderDialog(props: { open?: boolean; plan?: typeof starterPlan } = {}) {
  const onOpenChange = vi.fn()
  renderWithProviders(
    <PlanFormDialog open={props.open ?? true} onOpenChange={onOpenChange} plan={props.plan} />,
  )
  return { onOpenChange }
}

describe('PlanFormDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
    toastSuccess.mockReset()
    toastError.mockReset()
  })

  it('maps 422 validation errors to form fields on create', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Starter Copy')
    await userEvent.type(screen.getByLabelText('Slug'), 'starter')
    await userEvent.click(screen.getByRole('button', { name: /create plan/i }))

    await waitFor(() => {
      expect(screen.getByText(/already been taken/i)).toBeInTheDocument()
    })
  })

  it('closes dialog and shows success toast on create', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog()

    await userEvent.type(screen.getByLabelText('Name'), 'Enterprise')
    await userEvent.type(screen.getByLabelText('Slug'), 'enterprise')
    await userEvent.click(screen.getByRole('button', { name: /create plan/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Plan created')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('updates an existing plan', async () => {
    setToken('admin-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { onOpenChange } = renderDialog({ plan: starterPlan })

    await userEvent.clear(screen.getByLabelText('Name'))
    await userEvent.type(screen.getByLabelText('Name'), 'Starter Plus')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Plan updated')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
