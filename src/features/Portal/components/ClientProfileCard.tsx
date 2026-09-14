import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { PortalClientResponse } from '../types'

type ClientProfileCardProps = {
  client: PortalClientResponse
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function ClientProfileCard({ client }: ClientProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-heading text-xl">{client.name}</CardTitle>
          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
            {formatStatus(client.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Contact email</span>
          <p>{client.contact_email ?? '—'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
