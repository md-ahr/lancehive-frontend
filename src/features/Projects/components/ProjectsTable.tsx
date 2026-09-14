import { useNavigate } from 'react-router-dom'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

import type { ProjectResource, ProjectStatus } from '../types'

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

const baseColumns: Array<DataTableColumn<ProjectResource>> = [
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

function buildColumns(clientNames?: Record<number, string>) {
  if (!clientNames) {
    return baseColumns
  }

  return [
    baseColumns[0],
    {
      id: 'client',
      header: 'Client',
      cell: (project: ProjectResource) => clientNames[project.client_id] ?? '—',
    },
    ...baseColumns.slice(1),
  ] satisfies Array<DataTableColumn<ProjectResource>>
}

type ProjectsTableProps = {
  projects: ProjectResource[]
  clientNames?: Record<number, string>
  isLoading?: boolean
}

export function ProjectsTable({ projects, clientNames, isLoading }: ProjectsTableProps) {
  const navigate = useNavigate()
  const columns = buildColumns(clientNames)

  return (
    <DataTable
      columns={columns}
      data={projects}
      isLoading={isLoading}
      getRowId={(project) => project.id}
      onRowClick={(project) => navigate(`/app/projects/${project.id}`)}
    />
  )
}
