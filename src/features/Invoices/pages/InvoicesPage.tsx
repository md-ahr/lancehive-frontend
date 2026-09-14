import { useState } from 'react'

import { FileText } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { InvoiceStatus } from '../types'

import { InvoicesTable } from '../components/InvoicesTable'
import { useClientInvoiceList } from '../hooks/useClientInvoiceList'

const STATUS_OPTIONS: Array<{ value: 'all' | InvoiceStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'void', label: 'Void' },
]

export function InvoicesPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')
  const invoices = useClientInvoiceList({
    cursor,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  const statusControl = (
    <Select
      value={statusFilter}
      onValueChange={(value) => {
        setStatusFilter(value as 'all' | InvoiceStatus)
        setCursor(undefined)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  if (invoices.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (invoices.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Invoices"
          description="Track client invoices across all projects."
          actions={statusControl}
        />
        <ErrorAlert error={invoices.error} onRetry={() => void invoices.refetch()} />
      </div>
    )
  }

  const invoiceData = invoices.data?.data ?? []
  const meta = invoices.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Track client invoices across all projects."
        actions={statusControl}
      />

      {invoiceData.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create invoices from a project to start billing clients."
        />
      ) : (
        <div className="space-y-4">
          <InvoicesTable invoices={invoiceData} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
