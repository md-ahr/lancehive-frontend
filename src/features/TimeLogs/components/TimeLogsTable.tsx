import { Pencil, Trash2 } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import type { TimeLogResource } from '../types'

function formatLoggedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatDescription(value: string | null) {
  return value ?? '—'
}

function renderStatus(timeLog: TimeLogResource) {
  if (timeLog.client_invoice_item_id !== null) {
    return <Badge variant="secondary">Billed</Badge>
  }

  return <Badge variant="outline">Unbilled</Badge>
}

type TimeLogActionsProps = {
  timeLog: TimeLogResource
  onEdit?: (timeLog: TimeLogResource) => void
  onDelete?: (timeLog: TimeLogResource) => void
}

function TimeLogActions({ timeLog, onEdit, onDelete }: TimeLogActionsProps) {
  if (timeLog.client_invoice_item_id !== null) {
    return null
  }

  return (
    <div className="flex justify-end gap-1">
      {onEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit time log"
          onClick={(event) => {
            event.stopPropagation()
            onEdit(timeLog)
          }}
        >
          <Pencil className="size-4" />
        </Button>
      ) : null}
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete time log"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(timeLog)
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

const baseColumns: Array<DataTableColumn<TimeLogResource>> = [
  {
    id: 'logged_at',
    header: 'Logged at',
    cell: (timeLog) => formatLoggedAt(timeLog.logged_at),
  },
  {
    id: 'hours',
    header: 'Hours',
    cell: (timeLog) => <span className="tabular-nums">{timeLog.hours}h</span>,
  },
  {
    id: 'description',
    header: 'Description',
    cell: (timeLog) => formatDescription(timeLog.description),
  },
  {
    id: 'status',
    header: 'Status',
    cell: renderStatus,
  },
]

type TimeLogsTableProps = {
  timeLogs: TimeLogResource[]
  isLoading?: boolean
  onEdit?: (timeLog: TimeLogResource) => void
  onDelete?: (timeLog: TimeLogResource) => void
}

function buildColumns(
  onEdit?: (timeLog: TimeLogResource) => void,
  onDelete?: (timeLog: TimeLogResource) => void,
): Array<DataTableColumn<TimeLogResource>> {
  if (!onEdit && !onDelete) {
    return baseColumns
  }

  return [
    ...baseColumns,
    {
      id: 'actions',
      header: '',
      cell: (timeLog: TimeLogResource) => (
        <TimeLogActions timeLog={timeLog} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}

export function TimeLogsTable({ timeLogs, isLoading, onEdit, onDelete }: TimeLogsTableProps) {
  const canWrite = useCanWrite()
  const columns = canWrite ? buildColumns(onEdit, onDelete) : baseColumns

  return (
    <DataTable
      columns={columns}
      data={timeLogs}
      isLoading={isLoading}
      getRowId={(timeLog) => timeLog.id}
      emptyMessage="No time logged yet."
    />
  )
}
