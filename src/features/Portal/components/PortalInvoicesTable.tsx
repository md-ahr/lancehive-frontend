import type { ClientInvoiceResource } from '@/features/Invoices/types'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import {
  formatCurrency,
  formatInvoiceDate,
  formatInvoiceStatus,
  invoiceStatusBadgeVariant,
} from '@/features/Invoices/lib/format-invoice'

const columns: Array<DataTableColumn<ClientInvoiceResource>> = [
  {
    id: 'invoice_number',
    header: 'Invoice',
    cell: (invoice) => invoice.invoice_number,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (invoice) => (
      <Badge variant={invoiceStatusBadgeVariant(invoice.status)}>
        {formatInvoiceStatus(invoice.status)}
      </Badge>
    ),
  },
  {
    id: 'due_date',
    header: 'Due date',
    cell: (invoice) => formatInvoiceDate(invoice.due_date),
  },
  {
    id: 'total',
    header: 'Total',
    cell: (invoice) => (
      <span className="tabular-nums">{formatCurrency(invoice.total, invoice.currency)}</span>
    ),
  },
]

type PortalInvoicesTableProps = {
  invoices: ClientInvoiceResource[]
  isLoading?: boolean
}

export function PortalInvoicesTable({ invoices, isLoading }: PortalInvoicesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={invoices}
      isLoading={isLoading}
      getRowId={(invoice) => invoice.id}
    />
  )
}
