import { useState } from 'react'

import { FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import { useProjectInvoiceList } from '../hooks/useProjectInvoiceList'
import { CreateInvoiceDialog } from './CreateInvoiceDialog'
import { InvoicesTable } from './InvoicesTable'

type ProjectInvoicesTabProps = {
  projectId: number
}

export function ProjectInvoicesTab({ projectId }: ProjectInvoicesTabProps) {
  const navigate = useNavigate()
  const [cursor, setCursor] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const canWrite = useCanWrite()
  const invoices = useProjectInvoiceList({ projectId: String(projectId), cursor })

  const createAction = canWrite ? (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create invoice
    </Button>
  ) : null

  if (invoices.isPending) {
    return <LoadingSkeleton variant="table" />
  }

  if (invoices.isError) {
    return <ErrorAlert error={invoices.error} onRetry={() => void invoices.refetch()} />
  }

  const invoiceData = invoices.data?.data ?? []
  const meta = invoices.data?.meta

  if (invoiceData.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create a draft invoice for this project."
          action={createAction}
        />
        <CreateInvoiceDialog
          projectId={String(projectId)}
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={(invoiceId) => navigate(`/app/invoices/${invoiceId}`)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{createAction}</div>
      <InvoicesTable invoices={invoiceData} />
      {meta ? (
        <CursorPagination
          meta={meta}
          onNext={() => setCursor(meta.next_cursor ?? undefined)}
          onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
        />
      ) : null}
      <CreateInvoiceDialog
        projectId={String(projectId)}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(invoiceId) => navigate(`/app/invoices/${invoiceId}`)}
      />
    </div>
  )
}
