import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders title, description, and actions', () => {
    render(
      <PageHeader
        title="Clients"
        description="Manage your clients"
        actions={<Button type="button">Add client</Button>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
    expect(screen.getByText('Manage your clients')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add client' })).toBeInTheDocument()
  })
})
