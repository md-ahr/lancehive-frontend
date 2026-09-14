import type { ClientMembershipRole } from '@/types/api'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

import type { ClientMemberResource } from '../types'

function roleBadgeVariant(role: ClientMembershipRole) {
  if (role === 'primary') {
    return 'default' as const
  }

  if (role === 'member') {
    return 'secondary' as const
  }

  return 'outline' as const
}

function formatRole(role: ClientMembershipRole) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatJoinedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const columns: Array<DataTableColumn<ClientMemberResource>> = [
  {
    id: 'name',
    header: 'Name',
    cell: (member) => member.user?.name ?? '—',
  },
  {
    id: 'email',
    header: 'Email',
    cell: (member) => member.user?.email ?? '—',
  },
  {
    id: 'role',
    header: 'Role',
    cell: (member) => (
      <Badge variant={roleBadgeVariant(member.role)}>{formatRole(member.role)}</Badge>
    ),
  },
  {
    id: 'joined',
    header: 'Joined',
    cell: (member) => formatJoinedAt(member.created_at),
  },
]

type ClientMembersTableProps = {
  members: ClientMemberResource[]
  isLoading?: boolean
}

export function ClientMembersTable({ members, isLoading }: ClientMembersTableProps) {
  return (
    <DataTable
      columns={columns}
      data={members}
      isLoading={isLoading}
      getRowId={(member) => member.id}
    />
  )
}
