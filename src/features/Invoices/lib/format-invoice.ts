import type { InvoiceStatus } from '../types'

export function formatCurrency(amount: string, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount))
}

export function formatInvoiceDate(value: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatInvoiceStatus(status: InvoiceStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function invoiceStatusBadgeVariant(status: InvoiceStatus) {
  if (status === 'paid') {
    return 'default' as const
  }

  if (status === 'sent' || status === 'overdue') {
    return 'secondary' as const
  }

  if (status === 'void') {
    return 'outline' as const
  }

  return 'outline' as const
}
