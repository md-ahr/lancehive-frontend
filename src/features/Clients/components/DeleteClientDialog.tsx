import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ApiError, getErrorCode, getUserMessage } from '@/lib/errors'

import type { ClientResource } from '../types'

import { useDeleteClient } from '../hooks/useDeleteClient'

type DeleteClientDialogProps = {
  client: ClientResource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClientDialog({ client, open, onOpenChange }: DeleteClientDialogProps) {
  const navigate = useNavigate()
  const deleteClient = useDeleteClient()

  async function handleConfirm() {
    try {
      await deleteClient.mutateAsync(String(client.id))
      toast.success('Client archived')
      onOpenChange(false)
      navigate('/app/clients')
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
      title="Archive client?"
      description={`${client.name} will be archived. Existing projects will remain available.`}
      confirmLabel="Archive client"
      onConfirm={() => void handleConfirm()}
      isLoading={deleteClient.isPending}
    />
  )
}
