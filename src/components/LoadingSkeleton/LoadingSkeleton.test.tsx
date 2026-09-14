import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoadingSkeleton } from './LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders page variant', () => {
    render(<LoadingSkeleton variant="page" />)
    expect(screen.getByTestId('loading-skeleton-page')).toBeInTheDocument()
  })

  it('renders table variant', () => {
    render(<LoadingSkeleton variant="table" />)
    expect(screen.getByTestId('loading-skeleton-table')).toBeInTheDocument()
  })

  it('renders card variant', () => {
    render(<LoadingSkeleton variant="card" />)
    expect(screen.getByTestId('loading-skeleton-card')).toBeInTheDocument()
  })
})
