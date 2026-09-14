import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ApiError, getErrorCode, getUserMessage } from '@/lib/errors'

import type { TimeLogResource } from '../types'

import { useDeleteTimeLog } from '../hooks/useDeleteTimeLog'

type DeleteTimeLogDialogProps = {
  timeLog: TimeLogResource
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteTimeLogDialog({
  timeLog,
  projectId,
  open,
  onOpenChange,
  onDeleted,
}: DeleteTimeLogDialogProps) {
  const deleteTimeLog = useDeleteTimeLog()

  async function handleConfirm() {
    try {
      await deleteTimeLog.mutateAsync({
        id: String(timeLog.id),
        taskId: String(timeLog.task_id),
        projectId: String(projectId),
      })
      toast.success('Time log deleted')
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

  const description = timeLog.description
    ? `"${timeLog.description}" (${timeLog.hours}h) will be permanently deleted.`
    : `This ${timeLog.hours}h entry will be permanently deleted.`

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete time log?"
      description={description}
      confirmLabel="Delete time log"
      onConfirm={() => void handleConfirm()}
      isLoading={deleteTimeLog.isPending}
    />
  )
}
