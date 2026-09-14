import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthBrand } from './AuthBrand'

describe('AuthBrand', () => {
  it('renders brand name and tagline', () => {
    render(<AuthBrand />)

    expect(screen.getByText('LanceHive')).toBeInTheDocument()
    expect(screen.getByText('Freelance operations, simplified')).toBeInTheDocument()
  })
})
