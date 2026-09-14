import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ErrorAlert } from './ErrorAlert'
import { ApiError } from '@/lib/errors'

describe('ErrorAlert', () => {
  it('renders user message from ApiError', () => {
    render(<ErrorAlert error={new ApiError(403, { code: 'forbidden' })} />)
    expect(screen.getByText("You don't have permission to do that.")).toBeInTheDocument()
  })

  it('shows retry button when onRetry is passed', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ErrorAlert error={new ApiError(500, {})} onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
