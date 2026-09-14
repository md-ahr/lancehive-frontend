import type { ClientListResponse, ClientResource } from '@/features/Clients/types'

const timestamps = {
  created_at: '2026-01-15T10:00:00+00:00',
  updated_at: '2026-01-15T10:00:00+00:00',
}

export const sampleClients: ClientResource[] = [
  {
    id: 10,
    name: 'BigCo Ltd',
    status: 'active',
    contact_email: 'billing@bigco.com',
    ...timestamps,
  },
  {
    id: 11,
    name: 'Acme Studio',
    status: 'active',
    contact_email: 'hello@acme.test',
    ...timestamps,
  },
  {
    id: 12,
    name: 'Northwind Agency',
    status: 'archived',
    contact_email: null,
    ...timestamps,
  },
]

export const pageTwoClient: ClientResource = {
  id: 13,
  name: 'Page Two Client',
  status: 'active',
  contact_email: 'page-two@client.test',
  ...timestamps,
}

export const defaultClientListResponse: ClientListResponse = {
  data: sampleClients,
  links: {
    first: '/api/v1/clients',
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

export const emptyClientListResponse: ClientListResponse = {
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

export const paginatedClientListPageOne: ClientListResponse = {
  data: sampleClients.slice(0, 2),
  links: {
    first: '/api/v1/clients',
    last: null,
    prev: null,
    next: '/api/v1/clients?cursor=page-2',
  },
  meta: {
    per_page: 25,
    next_cursor: 'page-2',
    prev_cursor: null,
  },
}

export const paginatedClientListPageTwo: ClientListResponse = {
  data: [pageTwoClient],
  links: {
    first: '/api/v1/clients',
    last: null,
    prev: '/api/v1/clients',
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: 'page-1',
  },
}
