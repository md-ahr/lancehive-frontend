import { useMemo, useState } from 'react'

import { ListTodo, Plus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import type { TaskResource } from '../types'

import { useProjectTasks } from '../hooks/useProjectTasks'
import { TaskDetailSheet } from './TaskDetailSheet'
import { TaskFormDialog } from './TaskFormDialog'
import { TasksTable } from './TasksTable'

type ProjectTasksTabProps = {
  projectId: number
}

export function ProjectTasksTab({ projectId }: ProjectTasksTabProps) {
  const [cursor, setCursor] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const canWrite = useCanWrite()
  const tasks = useProjectTasks({ projectId: String(projectId), cursor })

  const createAction = canWrite ? (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create task
    </Button>
  ) : null

  const taskData = useMemo(() => tasks.data?.data ?? [], [tasks.data?.data])
  const meta = tasks.data?.meta

  function handleRowClick(task: TaskResource) {
    setSelectedTaskId(task.id)
  }

  if (tasks.isPending) {
    return <LoadingSkeleton variant="table" />
  }

  if (tasks.isError) {
    return <ErrorAlert error={tasks.error} onRetry={() => void tasks.refetch()} />
  }

  if (taskData.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Create the first task for this project."
          action={createAction}
        />
        <TaskFormDialog projectId={projectId} open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{createAction}</div>
      <TasksTable tasks={taskData} onRowClick={handleRowClick} />
      {meta ? (
        <CursorPagination
          meta={meta}
          onNext={() => setCursor(meta.next_cursor ?? undefined)}
          onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
        />
      ) : null}
      <TaskFormDialog projectId={projectId} open={createOpen} onOpenChange={setCreateOpen} />
      <TaskDetailSheet
        taskId={selectedTaskId}
        projectId={projectId}
        open={selectedTaskId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null)
          }
        }}
      />
    </div>
  )
}
