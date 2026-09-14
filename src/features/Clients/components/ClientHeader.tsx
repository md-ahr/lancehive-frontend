import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'

import type { ClientResource, ClientStatus } from '../types'

function statusBadgeVariant(status: ClientStatus) {
  if (status === 'active') {
    return 'default' as const
  }

  return 'secondary' as const
}

function formatStatus(status: ClientStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type ClientHeaderProps = {
  client: ClientResource
  actions?: ReactNode
}

export function ClientHeader({ client, actions }: ClientHeaderProps) {
  return (
    <div className="border-border flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{client.name}</h1>
          <Badge variant={statusBadgeVariant(client.status)}>{formatStatus(client.status)}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {client.contact_email ?? 'No contact email provided'}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
