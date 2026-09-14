import type {
  ClientInvoiceDetailResource,
  ClientInvoiceListResponse,
  ClientInvoiceResource,
} from '@/features/Invoices/types'

const timestamps = {
  created_at: '2026-03-10T10:00:00+00:00',
  updated_at: '2026-03-10T10:00:00+00:00',
}

export const sampleDraftInvoice: ClientInvoiceResource = {
  id: 50,
  project_id: 20,
  invoice_number: 'INV-2026-0001',
  status: 'draft',
  currency: 'BDT',
  subtotal: '7500.00',
  tax_rate: '0.00',
  tax_amount: '0.00',
  total: '7500.00',
  issued_at: null,
  due_date: '2026-04-15',
  sent_at: null,
  paid_at: null,
  notes: 'Payment via bank transfer.',
  bill_to_name: 'BigCo Ltd',
  bill_to_email: 'billing@bigco.com',
  bill_to_address: null,
  ...timestamps,
}

export const sampleSentInvoice: ClientInvoiceResource = {
  id: 51,
  project_id: 20,
  invoice_number: 'INV-2026-0002',
  status: 'sent',
  currency: 'BDT',
  subtotal: '12000.00',
  tax_rate: '0.00',
  tax_amount: '0.00',
  total: '12000.00',
  issued_at: '2026-03-01',
  due_date: '2026-03-31',
  sent_at: '2026-03-01T09:00:00+00:00',
  paid_at: null,
  notes: null,
  bill_to_name: 'BigCo Ltd',
  bill_to_email: 'billing@bigco.com',
  bill_to_address: null,
  ...timestamps,
}

export const samplePaidInvoice: ClientInvoiceResource = {
  id: 52,
  project_id: 21,
  invoice_number: 'INV-2026-0003',
  status: 'paid',
  currency: 'BDT',
  subtotal: '5000.00',
  tax_rate: '0.00',
  tax_amount: '0.00',
  total: '5000.00',
  issued_at: '2026-02-01',
  due_date: '2026-02-28',
  sent_at: '2026-02-01T10:00:00+00:00',
  paid_at: '2026-02-15T14:00:00+00:00',
  notes: null,
  bill_to_name: 'Acme Studio',
  bill_to_email: 'accounts@acme.test',
  bill_to_address: null,
  ...timestamps,
}

export const pageTwoInvoice: ClientInvoiceResource = {
  id: 53,
  project_id: 22,
  invoice_number: 'INV-2026-0004',
  status: 'draft',
  currency: 'BDT',
  subtotal: '3000.00',
  tax_rate: '0.00',
  tax_amount: '0.00',
  total: '3000.00',
  issued_at: null,
  due_date: null,
  sent_at: null,
  paid_at: null,
  notes: null,
  bill_to_name: 'Northwind Agency',
  bill_to_email: null,
  bill_to_address: null,
  ...timestamps,
}

export const sampleInvoices: ClientInvoiceResource[] = [
  sampleDraftInvoice,
  sampleSentInvoice,
  samplePaidInvoice,
]

export const defaultInvoiceListResponse: ClientInvoiceListResponse = {
  data: sampleInvoices,
  meta: { per_page: 25, next_cursor: null, prev_cursor: null },
  links: { first: '', last: null, prev: null, next: null },
}

export const emptyInvoiceListResponse: ClientInvoiceListResponse = {
  data: [],
  meta: { per_page: 25, next_cursor: null, prev_cursor: null },
  links: { first: '', last: null, prev: null, next: null },
}

export const paginatedInvoiceListPageOne: ClientInvoiceListResponse = {
  data: [sampleDraftInvoice, sampleSentInvoice],
  meta: { per_page: 25, next_cursor: 'page-2', prev_cursor: null },
  links: { first: '', last: null, prev: null, next: 'page-2' },
}

export const paginatedInvoiceListPageTwo: ClientInvoiceListResponse = {
  data: [pageTwoInvoice],
  meta: { per_page: 25, next_cursor: null, prev_cursor: 'page-1' },
  links: { first: '', last: null, prev: 'page-1', next: null },
}

export function projectInvoicesResponse(projectId: number): ClientInvoiceListResponse {
  const data = sampleInvoices.filter((invoice) => invoice.project_id === projectId)
  return {
    data,
    meta: { per_page: 25, next_cursor: null, prev_cursor: null },
    links: { first: '', last: null, prev: null, next: null },
  }
}

export const sampleDraftInvoiceDetail: ClientInvoiceDetailResource = {
  ...sampleDraftInvoice,
  outstanding_balance: '7500.00',
  items: [
    {
      id: 1,
      description: 'Website development — 5h',
      quantity: '5.00',
      rate: '1500.00',
      amount: '7500.00',
      created_at: timestamps.created_at,
      updated_at: timestamps.updated_at,
    },
  ],
  payments: [],
}

export const sampleSentInvoiceDetail: ClientInvoiceDetailResource = {
  ...sampleSentInvoice,
  outstanding_balance: '12000.00',
  items: [
    {
      id: 2,
      description: 'Mobile app sprint',
      quantity: '8.00',
      rate: '1500.00',
      amount: '12000.00',
      created_at: timestamps.created_at,
      updated_at: timestamps.updated_at,
    },
  ],
  payments: [],
}

export const samplePaidInvoiceDetail: ClientInvoiceDetailResource = {
  ...samplePaidInvoice,
  outstanding_balance: '0.00',
  items: [
    {
      id: 3,
      description: 'Brand refresh',
      quantity: '4.00',
      rate: '1250.00',
      amount: '5000.00',
      created_at: timestamps.created_at,
      updated_at: timestamps.updated_at,
    },
  ],
  payments: [
    {
      id: 1,
      amount: '5000.00',
      payment_method: 'bank_transfer',
      reference: 'TXN-123',
      paid_at: '2026-02-15T14:00:00+00:00',
      notes: null,
      created_at: timestamps.created_at,
      updated_at: timestamps.updated_at,
    },
  ],
}
