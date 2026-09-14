import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ApiError, getErrorCode, getUserMessage } from '@/lib/errors'

import type { TaskResource } from '../types'

import { useDeleteTask } from '../hooks/useDeleteTask'

type DeleteTaskDialogProps = {
  task: TaskResource
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteTaskDialog({ task, open, onOpenChange, onDeleted }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask()

  async function handleConfirm() {
    try {
      await deleteTask.mutateAsync({
        id: String(task.id),
        projectId: String(task.project_id),
      })
      toast.success('Task deleted')
      onOpenChange(false)
      onDeleted?.()
    } catch (error) {
      if (error instanceof ApiError && getErrorCode(error) === 'workspace_read_only') {
        toast.error('Your workspace is read-only. Renew your subscription to make changes.')
        return
      }

      toast.error(getUserMessage(error))
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete task?"
      description={`"${task.title}" will be permanently deleted.`}
      confirmLabel="Delete task"
      onConfirm={() => void handleConfirm()}
      isLoading={deleteTask.isPending}
    />
  )
}
