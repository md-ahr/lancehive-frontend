import type { InvoiceStatus } from '@/features/Invoices/types'

export const portalKeys = {
  all: ['portal'] as const,
  client: () => [...portalKeys.all, 'client'] as const,
  projects: () => [...portalKeys.all, 'projects'] as const,
  projectList: (filters: { cursor?: string } = {}) => [...portalKeys.projects(), filters] as const,
  invoices: () => [...portalKeys.all, 'invoices'] as const,
  invoiceList: (filters: { cursor?: string; status?: InvoiceStatus } = {}) =>
    [...portalKeys.invoices(), filters] as const,
}
