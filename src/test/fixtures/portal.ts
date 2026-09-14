import type { ClientResource } from '@/features/Clients/types'
import type { ClientInvoiceListResponse } from '@/features/Invoices/types'
import type { ProjectListResponse } from '@/features/Projects/types'

import { sampleClients } from './clients'
import { samplePaidInvoice, sampleSentInvoice } from './invoices'
import { sampleProjects } from './projects'

const timestamps = {
  created_at: '2026-01-15T10:00:00+00:00',
  updated_at: '2026-01-15T10:00:00+00:00',
}

export const portalClient: ClientResource = {
  id: 10,
  name: 'Acme Corp',
  status: 'active',
  contact_email: 'billing@acme.test',
  ...timestamps,
}

export const portalClientResponse = portalClient

export const portalProjectsResponse: ProjectListResponse = {
  data: sampleProjects.filter((project) => project.client_id === 10),
  links: {
    first: '/api/v1/portal/projects',
    last: null,
    prev: null,
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: null,
  },
}

export const emptyPortalProjectsResponse: ProjectListResponse = {
  data: [],
  links: {
    first: null,
    last: null,
    prev: null,
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: null,
  },
}

export const portalInvoicesResponse: ClientInvoiceListResponse = {
  data: [sampleSentInvoice, samplePaidInvoice],
  links: {
    first: '/api/v1/portal/client-invoices',
    last: null,
    prev: null,
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: null,
  },
}

export const emptyPortalInvoicesResponse: ClientInvoiceListResponse = {
  data: [],
  links: {
    first: null,
    last: null,
    prev: null,
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: null,
  },
}

export { sampleClients }
