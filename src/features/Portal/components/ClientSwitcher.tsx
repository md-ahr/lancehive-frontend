import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { usePortalContext } from '../hooks/usePortalContext'

export function ClientSwitcher() {
  const { clientId, setClientId, memberships, activeClient } = usePortalContext()

  if (memberships.length <= 1) {
    return null
  }

  const activeName =
    memberships.find((membership) => String(membership.client_id) === clientId)?.client?.name ??
    activeClient?.name ??
    'Client'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="max-w-[200px] justify-between gap-2">
            <span className="truncate">{activeName}</span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[220px]">
        {memberships.map((membership) => {
          const id = String(membership.client_id)
          const name = membership.client?.name ?? `Client ${id}`

          return (
            <DropdownMenuItem key={id} onClick={() => setClientId(id)}>
              <span className={id === clientId ? 'font-medium' : undefined}>{name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
