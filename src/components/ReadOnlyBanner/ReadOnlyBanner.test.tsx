import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/test-utils'

import { ReadOnlyBanner } from './ReadOnlyBanner'

describe('ReadOnlyBanner', () => {
  it('renders message and subscription link', () => {
    renderWithProviders(<ReadOnlyBanner />)

    expect(screen.getByText(/workspace is read-only/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Manage subscription' })).toHaveAttribute(
      'href',
      '/app/subscription',
    )
  })
})
