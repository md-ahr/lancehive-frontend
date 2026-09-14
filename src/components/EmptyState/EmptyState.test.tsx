import { render, screen } from '@testing-library/react'
import { Inbox } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'
import { Button } from '@/components/ui/button'

describe('EmptyState', () => {
  it('renders title, description, icon, and action', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No clients yet"
        description="Create your first client to get started."
        action={<Button type="button">Add client</Button>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'No clients yet' })).toBeInTheDocument()
    expect(screen.getByText('Create your first client to get started.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add client' })).toBeInTheDocument()
  })
})
