import type { ProjectResource, ProjectStatus } from '@/features/Projects/types'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

function statusBadgeVariant(status: ProjectStatus) {
  if (status === 'active') {
    return 'default' as const
  }

  if (status === 'completed') {
    return 'secondary' as const
  }

  return 'outline' as const
}

function formatStatus(status: ProjectStatus) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatHourlyRate(rate: string, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(rate))
}

function formatDeadline(value: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const columns: Array<DataTableColumn<ProjectResource>> = [
  {
    id: 'name',
    header: 'Name',
    cell: (project) => project.name,
  },
  {
    id: 'hourly_rate',
    header: 'Hourly rate',
    cell: (project) => (
      <span className="tabular-nums">
        {formatHourlyRate(project.hourly_rate, project.currency)}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (project) => (
      <Badge variant={statusBadgeVariant(project.status)}>{formatStatus(project.status)}</Badge>
    ),
  },
  {
    id: 'deadline',
    header: 'Deadline',
    cell: (project) => formatDeadline(project.deadline),
  },
]

type PortalProjectsTableProps = {
  projects: ProjectResource[]
  isLoading?: boolean
}

export function PortalProjectsTable({ projects, isLoading }: PortalProjectsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={projects}
      isLoading={isLoading}
      getRowId={(project) => project.id}
    />
  )
}
