import { useNavigate } from 'react-router-dom'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
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

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const columns: Array<DataTableColumn<ClientResource>> = [
  {
    id: 'name',
    header: 'Name',
    cell: (client) => client.name,
  },
  {
    id: 'contact_email',
    header: 'Contact email',
    cell: (client) => client.contact_email ?? '—',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (client) => (
      <Badge variant={statusBadgeVariant(client.status)}>{formatStatus(client.status)}</Badge>
    ),
  },
  {
    id: 'created_at',
    header: 'Created',
    cell: (client) => formatCreatedAt(client.created_at),
  },
]

type ClientsTableProps = {
  clients: ClientResource[]
  isLoading?: boolean
}

export function ClientsTable({ clients, isLoading }: ClientsTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={clients}
      isLoading={isLoading}
      getRowId={(client) => client.id}
      onRowClick={(client) => navigate(`/app/clients/${client.id}`)}
    />
  )
}
