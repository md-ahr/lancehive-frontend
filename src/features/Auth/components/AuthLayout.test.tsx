import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders children inside the auth card', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<p>Login form</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('LanceHive')).toBeInTheDocument()
    expect(screen.getByText('Freelance operations, simplified')).toBeInTheDocument()
    expect(screen.getByText('Login form')).toBeInTheDocument()
  })
})
