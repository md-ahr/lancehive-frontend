import { useMemo, useState } from 'react'

import { Clock } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

import type { TimeLogResource } from '../types'

import { useTaskTimeLogs } from '../hooks/useTaskTimeLogs'
import { DeleteTimeLogDialog } from './DeleteTimeLogDialog'
import { TimeLogsTable } from './TimeLogsTable'

type TimeLogsListProps = {
  taskId: number
  projectId: number
  onEdit?: (timeLog: TimeLogResource) => void
}

export function TimeLogsList({ taskId, projectId, onEdit }: TimeLogsListProps) {
  const [cursor, setCursor] = useState<string | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<TimeLogResource | null>(null)
  const timeLogs = useTaskTimeLogs({ taskId: String(taskId), cursor })

  const logData = useMemo(() => timeLogs.data?.data ?? [], [timeLogs.data?.data])
  const meta = timeLogs.data?.meta

  if (timeLogs.isPending) {
    return <LoadingSkeleton variant="table" />
  }

  if (timeLogs.isError) {
    return <ErrorAlert error={timeLogs.error} onRetry={() => void timeLogs.refetch()} />
  }

  if (logData.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No time logged yet"
        description="Log your first entry using the form above."
      />
    )
  }

  return (
    <div className="space-y-4">
      <TimeLogsTable
        timeLogs={logData}
        onEdit={onEdit}
        onDelete={(timeLog) => setDeleteTarget(timeLog)}
      />
      {meta ? (
        <CursorPagination
          meta={meta}
          onNext={() => setCursor(meta.next_cursor ?? undefined)}
          onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
        />
      ) : null}
      {deleteTarget ? (
        <DeleteTimeLogDialog
          timeLog={deleteTarget}
          projectId={projectId}
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null)
            }
          }}
        />
      ) : null}
    </div>
  )
}
