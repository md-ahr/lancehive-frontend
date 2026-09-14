import type { ClientMemberListResponse, ClientMemberResource } from '@/features/Clients/types'

const timestamps = {
  created_at: '2026-01-20T10:00:00+00:00',
  updated_at: '2026-01-20T10:00:00+00:00',
}

export const sampleClientMembers: ClientMemberResource[] = [
  {
    id: 1,
    client_id: 10,
    user_id: 101,
    role: 'primary',
    user: {
      id: 101,
      name: 'Sam Primary',
      email: 'sam@bigco.com',
      role: 'client',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
  {
    id: 2,
    client_id: 10,
    user_id: 102,
    role: 'member',
    user: {
      id: 102,
      name: 'Taylor Member',
      email: 'taylor@bigco.com',
      role: 'client',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
  {
    id: 3,
    client_id: 10,
    user_id: 103,
    role: 'viewer',
    user: {
      id: 103,
      name: 'Jordan Viewer',
      email: 'jordan@bigco.com',
      role: 'client',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
]

export const pageTwoClientMember: ClientMemberResource = {
  id: 4,
  client_id: 10,
  user_id: 104,
  role: 'member',
  user: {
    id: 104,
    name: 'Page Two Contact',
    email: 'page-two@bigco.com',
    role: 'client',
    email_verified_at: null,
    ...timestamps,
  },
  ...timestamps,
}

export const defaultClientMemberListResponse: ClientMemberListResponse = {
  data: sampleClientMembers,
  links: {
    first: '/api/v1/clients/10/members',
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

export const emptyClientMemberListResponse: ClientMemberListResponse = {
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

export const paginatedClientMemberListPageOne: ClientMemberListResponse = {
  data: sampleClientMembers.slice(0, 2),
  links: {
    first: '/api/v1/clients/10/members',
    last: null,
    prev: null,
    next: '/api/v1/clients/10/members?cursor=page-2',
  },
  meta: {
    per_page: 25,
    next_cursor: 'page-2',
    prev_cursor: null,
  },
}

export const paginatedClientMemberListPageTwo: ClientMemberListResponse = {
  data: [pageTwoClientMember],
  links: {
    first: '/api/v1/clients/10/members',
    last: null,
    prev: '/api/v1/clients/10/members',
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: 'page-1',
  },
}
