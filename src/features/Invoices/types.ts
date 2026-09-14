import type { PaginatedResponse } from '@/types/api'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void'

export type PaymentMethod = 'manual' | 'bank_transfer' | 'cash' | 'other'

export type ClientInvoiceItemResource = {
  id: number
  description: string
  quantity: string
  rate: string
  amount: string
  created_at: string
  updated_at: string
}

export type ClientInvoicePaymentResource = {
  id: number
  amount: string
  payment_method: PaymentMethod
  reference: string | null
  paid_at: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type ClientInvoiceResource = {
  id: number
  project_id: number
  invoice_number: string
  status: InvoiceStatus
  currency: string
  subtotal: string
  tax_rate: string | null
  tax_amount: string
  total: string
  issued_at: string | null
  due_date: string | null
  sent_at: string | null
  paid_at: string | null
  notes: string | null
  bill_to_name: string
  bill_to_email: string | null
  bill_to_address: string | null
  created_at: string
  updated_at: string
}

export type ClientInvoiceDetailResource = ClientInvoiceResource & {
  outstanding_balance: string
  items: ClientInvoiceItemResource[]
  payments: ClientInvoicePaymentResource[]
}

export type ClientInvoiceListResponse = PaginatedResponse<ClientInvoiceResource>

export type CreateClientInvoiceRequest = {
  due_date?: string
  notes?: string
  tax_rate?: string
  prefill_unbilled_time?: boolean
}

export type UpdateClientInvoiceRequest = {
  status?: 'sent'
  due_date?: string
  notes?: string
  tax_rate?: string
}

export type AddInvoiceItemRequest = {
  description: string
  quantity: string
  rate: string
}

export type RecordInvoicePaymentRequest = {
  amount: string
  payment_method: PaymentMethod
  reference?: string
  paid_at: string
  notes?: string
}
