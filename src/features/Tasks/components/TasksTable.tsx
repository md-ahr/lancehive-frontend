import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

import type { TaskResource, TaskStatus } from '../types'

function statusBadgeVariant(status: TaskStatus) {
  if (status === 'done') {
    return 'secondary' as const
  }

  if (status === 'in_progress') {
    return 'default' as const
  }

  return 'outline' as const
}

function formatStatus(status: TaskStatus) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDueDate(value: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatEstimatedHours(value: string | null) {
  if (!value) {
    return '—'
  }

  return `${value}h`
}

const columns: Array<DataTableColumn<TaskResource>> = [
  {
    id: 'title',
    header: 'Title',
    cell: (task) => task.title,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (task) => (
      <Badge variant={statusBadgeVariant(task.status)}>{formatStatus(task.status)}</Badge>
    ),
  },
  {
    id: 'due_date',
    header: 'Due date',
    cell: (task) => formatDueDate(task.due_date),
  },
  {
    id: 'estimated_hours',
    header: 'Estimated',
    cell: (task) => (
      <span className="tabular-nums">{formatEstimatedHours(task.estimated_hours)}</span>
    ),
  },
]

type TasksTableProps = {
  tasks: TaskResource[]
  isLoading?: boolean
  onRowClick?: (task: TaskResource) => void
}

export function TasksTable({ tasks, isLoading, onRowClick }: TasksTableProps) {
  return (
    <DataTable
      columns={columns}
      data={tasks}
      isLoading={isLoading}
      getRowId={(task) => task.id}
      onRowClick={onRowClick}
    />
  )
}
