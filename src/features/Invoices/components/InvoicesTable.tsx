import { useNavigate } from 'react-router-dom'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'

import type { ClientInvoiceResource } from '../types'

import {
  formatCurrency,
  formatInvoiceDate,
  formatInvoiceStatus,
  invoiceStatusBadgeVariant,
} from '../lib/format-invoice'

const columns: Array<DataTableColumn<ClientInvoiceResource>> = [
  {
    id: 'invoice_number',
    header: 'Invoice',
    cell: (invoice) => invoice.invoice_number,
  },
  {
    id: 'bill_to_name',
    header: 'Bill to',
    cell: (invoice) => invoice.bill_to_name,
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

type InvoicesTableProps = {
  invoices: ClientInvoiceResource[]
  isLoading?: boolean
}

export function InvoicesTable({ invoices, isLoading }: InvoicesTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={invoices}
      isLoading={isLoading}
      getRowId={(invoice) => invoice.id}
      onRowClick={(invoice) => navigate(`/app/invoices/${invoice.id}`)}
    />
  )
}
