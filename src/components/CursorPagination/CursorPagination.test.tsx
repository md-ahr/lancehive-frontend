import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CursorPagination } from './CursorPagination'

const baseMeta = {
  per_page: 25,
  next_cursor: null,
  prev_cursor: null,
}

describe('CursorPagination', () => {
  it('disables prev/next when cursors are null', () => {
    render(<CursorPagination meta={baseMeta} onNext={vi.fn()} onPrev={vi.fn()} />)

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('enables buttons when cursors are present', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    const onPrev = vi.fn()

    render(
      <CursorPagination
        meta={{ ...baseMeta, next_cursor: 'next', prev_cursor: 'prev' }}
        onNext={onNext}
        onPrev={onPrev}
      />,
    )

    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    expect(prevButton).toBeEnabled()
    expect(nextButton).toBeEnabled()

    await user.click(prevButton)
    await user.click(nextButton)

    expect(onPrev).toHaveBeenCalledOnce()
    expect(onNext).toHaveBeenCalledOnce()
  })
})
