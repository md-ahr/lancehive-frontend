import type { InvoiceStatus } from './types'

export type InvoiceListFilters = {
  cursor?: string
  status?: InvoiceStatus
}

export const invoiceKeys = {
  all: ['client-invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: InvoiceListFilters = {}) => [...invoiceKeys.lists(), filters] as const,
  projectLists: () => [...invoiceKeys.all, 'project-list'] as const,
  projectList: (projectId: string, filters: InvoiceListFilters = {}) =>
    [...invoiceKeys.projectLists(), projectId, filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}
