import type { FreelancerMembershipRole } from '@/types/api'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

import type { MemberResource } from '../types'

function roleBadgeVariant(role: FreelancerMembershipRole) {
  if (role === 'owner') {
    return 'default' as const
  }

  if (role === 'admin') {
    return 'secondary' as const
  }

  return 'outline' as const
}

function formatRole(role: FreelancerMembershipRole) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatJoinedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const columns: Array<DataTableColumn<MemberResource>> = [
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

type MembersTableProps = {
  members: MemberResource[]
  isLoading?: boolean
}

export function MembersTable({ members, isLoading }: MembersTableProps) {
  return (
    <DataTable
      columns={columns}
      data={members}
      isLoading={isLoading}
      getRowId={(member) => member.id}
    />
  )
}
