import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useWorkspaceContext } from '../hooks/useWorkspaceContext'

export function WorkspaceSwitcher() {
  const { freelancerId, setFreelancerId, memberships, activeFreelancer } = useWorkspaceContext()

  if (memberships.length <= 1) {
    return null
  }

  const activeName =
    memberships.find((membership) => String(membership.freelancer_id) === freelancerId)?.freelancer
      ?.name ??
    activeFreelancer?.name ??
    'Workspace'

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
          const id = String(membership.freelancer_id)
          const name = membership.freelancer?.name ?? `Workspace ${id}`

          return (
            <DropdownMenuItem key={id} onClick={() => setFreelancerId(id)}>
              <span className={id === freelancerId ? 'font-medium' : undefined}>{name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
