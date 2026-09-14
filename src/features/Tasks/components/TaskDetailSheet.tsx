import { useState } from 'react'

import { Pencil, Trash2 } from 'lucide-react'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { ApiError, getErrorCode } from '@/lib/errors'

import type { TaskStatus } from '../types'

import { useTask } from '../hooks/useTask'
import { DeleteTaskDialog } from './DeleteTaskDialog'
import { TaskFormDialog } from './TaskFormDialog'

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

type TaskDetailSheetProps = {
  taskId: number | null
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailSheet({ taskId, projectId, open, onOpenChange }: TaskDetailSheetProps) {
  const canWrite = useCanWrite()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const taskQuery = useTask(taskId ? String(taskId) : undefined)

  const headerActions =
    canWrite && taskQuery.data ? (
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    ) : null

  function renderContent() {
    if (taskQuery.isPending) {
      return <LoadingSkeleton variant="card" />
    }

    if (taskQuery.isError) {
      const isNotFound =
        (taskQuery.error instanceof ApiError && taskQuery.error.status === 404) ||
        getErrorCode(taskQuery.error) === 'not_found'

      if (isNotFound) {
        return (
          <div className="border-border bg-card space-y-2 border p-4">
            <p className="font-medium">Task not found</p>
            <p className="text-muted-foreground text-sm">
              This task does not exist or is not available in your workspace.
            </p>
          </div>
        )
      }

      return <ErrorAlert error={taskQuery.error} onRetry={() => void taskQuery.refetch()} />
    }

    const task = taskQuery.data
    if (!task) {
      return null
    }

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Badge>{formatStatus(task.status)}</Badge>
            {headerActions}
          </div>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Due date</dt>
              <dd>{formatDueDate(task.due_date)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estimated hours</dt>
              <dd className="tabular-nums">
                {task.estimated_hours ? `${task.estimated_hours}h` : '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-border bg-card space-y-2 border p-4">
          <h3 className="text-sm font-medium">Time logs</h3>
          <p className="text-muted-foreground text-sm">
            Time entries for this task will appear here.
          </p>
        </div>

        <TaskFormDialog
          task={task}
          projectId={projectId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
        <DeleteTaskDialog
          task={task}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => onOpenChange(false)}
        />
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{taskQuery.data?.title ?? 'Task details'}</SheetTitle>
          <SheetDescription>View task details and logged time.</SheetDescription>
        </SheetHeader>
        <div className="p-4 pt-0">{renderContent()}</div>
      </SheetContent>
    </Sheet>
  )
}
