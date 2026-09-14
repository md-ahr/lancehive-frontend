import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { ApiError, getErrorCode, getUserMessage } from '@/lib/errors'

import type { ClientInvoiceDetailResource } from '../types'

import { useUpdateClientInvoice } from '../hooks/useUpdateClientInvoice'
import { useVoidClientInvoice } from '../hooks/useVoidClientInvoice'

type InvoiceStatusActionsProps = {
  invoice: ClientInvoiceDetailResource
  onAddItem: () => void
  onRecordPayment: () => void
}

export function InvoiceStatusActions({
  invoice,
  onAddItem,
  onRecordPayment,
}: InvoiceStatusActionsProps) {
  const navigate = useNavigate()
  const canWrite = useCanWrite()
  const updateInvoice = useUpdateClientInvoice()
  const voidInvoice = useVoidClientInvoice()
  const [voidOpen, setVoidOpen] = useState(false)

  const isDraft = invoice.status === 'draft'
  const canRecordPayment =
    invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'paid'

  async function handleMarkSent() {
    try {
      await updateInvoice.mutateAsync({ id: String(invoice.id), status: 'sent' })
      toast.success('Invoice marked as sent')
    } catch (error) {
      if (error instanceof ApiError && getErrorCode(error) === 'workspace_read_only') {
        toast.error('Your workspace is read-only. Renew your subscription to make changes.')
        return
      }

      toast.error(getUserMessage(error))
    }
  }

  async function handleVoid() {
    try {
      await voidInvoice.mutateAsync({
        id: String(invoice.id),
        projectId: String(invoice.project_id),
      })
      toast.success('Invoice voided')
      setVoidOpen(false)
      navigate('/app/invoices')
    } catch (error) {
      if (error instanceof ApiError && getErrorCode(error) === 'workspace_read_only') {
        toast.error('Your workspace is read-only. Renew your subscription to make changes.')
        return
      }

      if (error instanceof ApiError && getErrorCode(error) === 'invoice_not_editable') {
        toast.error('This invoice can no longer be voided.')
        return
      }

      toast.error(getUserMessage(error))
    }
  }

  if (!canWrite) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {isDraft ? (
        <>
          <Button type="button" variant="outline" onClick={onAddItem}>
            Add item
          </Button>
          <Button
            type="button"
            onClick={() => void handleMarkSent()}
            disabled={updateInvoice.isPending}
          >
            {updateInvoice.isPending ? 'Sending…' : 'Mark as sent'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setVoidOpen(true)}>
            Void draft
          </Button>
        </>
      ) : null}

      {canRecordPayment ? (
        <Button type="button" onClick={onRecordPayment}>
          Record payment
        </Button>
      ) : null}

      <ConfirmDialog
        open={voidOpen}
        onOpenChange={setVoidOpen}
        title="Void draft invoice?"
        description={`${invoice.invoice_number} will be permanently removed. This action cannot be undone.`}
        confirmLabel="Void invoice"
        onConfirm={() => void handleVoid()}
        isLoading={voidInvoice.isPending}
      />
    </div>
  )
}
