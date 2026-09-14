import { useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { ApiError, getErrorCode } from '@/lib/errors'

import { AddInvoiceItemDialog } from '../components/AddInvoiceItemDialog'
import { InvoiceItemsTable } from '../components/InvoiceItemsTable'
import { InvoiceStatusActions } from '../components/InvoiceStatusActions'
import { RecordPaymentDialog } from '../components/RecordPaymentDialog'
import { useClientInvoice } from '../hooks/useClientInvoice'
import {
  formatCurrency,
  formatInvoiceDate,
  formatInvoiceStatus,
  invoiceStatusBadgeVariant,
} from '../lib/format-invoice'

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const invoiceQuery = useClientInvoice(id)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  if (invoiceQuery.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (invoiceQuery.isError) {
    const isNotFound =
      (invoiceQuery.error instanceof ApiError && invoiceQuery.error.status === 404) ||
      getErrorCode(invoiceQuery.error) === 'not_found'

    if (isNotFound) {
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            <Link className="text-primary hover:underline" to="/app/invoices">
              Back to invoices
            </Link>
          </p>
          <div className="border-border bg-card space-y-2 border p-6">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Invoice not found</h1>
            <p className="text-muted-foreground text-sm">
              This invoice does not exist or is not available in your workspace.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <ErrorAlert error={invoiceQuery.error} onRetry={() => void invoiceQuery.refetch()} />
      </div>
    )
  }

  const invoice = invoiceQuery.data
  if (!invoice) {
    return null
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        <Link className="text-primary hover:underline" to="/app/invoices">
          Back to invoices
        </Link>
        {' · '}
        <Link className="text-primary hover:underline" to={`/app/projects/${invoice.project_id}`}>
          View project
        </Link>
      </p>

      <div className="border-border bg-card space-y-4 border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {invoice.invoice_number}
              </h1>
              <Badge variant={invoiceStatusBadgeVariant(invoice.status)}>
                {formatInvoiceStatus(invoice.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Bill to {invoice.bill_to_name}
              {invoice.bill_to_email ? ` · ${invoice.bill_to_email}` : ''}
            </p>
            <p className="text-muted-foreground text-sm">
              Due {formatInvoiceDate(invoice.due_date)}
            </p>
          </div>

          <InvoiceStatusActions
            invoice={invoice}
            onAddItem={() => setAddItemOpen(true)}
            onRecordPayment={() => setPaymentOpen(true)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Subtotal</p>
            <p className="font-heading text-lg font-semibold tabular-nums">
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Total</p>
            <p className="font-heading text-lg font-semibold tabular-nums">
              {formatCurrency(invoice.total, invoice.currency)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Outstanding</p>
            <p className="font-heading text-lg font-semibold tabular-nums">
              {formatCurrency(invoice.outstanding_balance, invoice.currency)}
            </p>
          </div>
        </div>

        {invoice.notes ? (
          <p className="text-muted-foreground border-border border-t pt-4 text-sm">
            {invoice.notes}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Line items</h2>
        <InvoiceItemsTable items={invoice.items} currency={invoice.currency} />
      </div>

      {invoice.payments.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Payments</h2>
          <div className="border-border bg-card divide-y border">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"
              >
                <div>
                  <p className="font-medium capitalize">
                    {payment.payment_method.replace('_', ' ')}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatInvoiceDate(payment.paid_at)}
                    {payment.reference ? ` · ${payment.reference}` : ''}
                  </p>
                </div>
                <p className="font-medium tabular-nums">
                  {formatCurrency(payment.amount, invoice.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <AddInvoiceItemDialog
        invoiceId={String(invoice.id)}
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
      />
      <RecordPaymentDialog
        invoiceId={String(invoice.id)}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />
    </div>
  )
}
