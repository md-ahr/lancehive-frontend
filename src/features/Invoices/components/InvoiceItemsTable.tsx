import { DataTable, type DataTableColumn } from '@/components/DataTable'

import type { ClientInvoiceItemResource } from '../types'

import { formatCurrency } from '../lib/format-invoice'

function buildColumns(currency: string): Array<DataTableColumn<ClientInvoiceItemResource>> {
  return [
    {
      id: 'description',
      header: 'Description',
      cell: (item) => item.description,
    },
    {
      id: 'quantity',
      header: 'Qty',
      cell: (item) => <span className="tabular-nums">{item.quantity}</span>,
    },
    {
      id: 'rate',
      header: 'Rate',
      cell: (item) => <span className="tabular-nums">{formatCurrency(item.rate, currency)}</span>,
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: (item) => <span className="tabular-nums">{formatCurrency(item.amount, currency)}</span>,
    },
  ]
}

type InvoiceItemsTableProps = {
  items: ClientInvoiceItemResource[]
  currency: string
  isLoading?: boolean
}

export function InvoiceItemsTable({ items, currency, isLoading }: InvoiceItemsTableProps) {
  return (
    <DataTable
      columns={buildColumns(currency)}
      data={items}
      isLoading={isLoading}
      getRowId={(item) => item.id}
    />
  )
}
