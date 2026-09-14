import type { MemberListResponse, MemberResource } from '@/features/Members/types'

const timestamps = {
  created_at: '2026-01-15T10:00:00+00:00',
  updated_at: '2026-01-15T10:00:00+00:00',
}

export const sampleMembers: MemberResource[] = [
  {
    id: 1,
    freelancer_id: 42,
    user_id: 1,
    role: 'owner',
    user: {
      id: 1,
      name: 'Jane Owner',
      email: 'jane@studio.test',
      role: 'freelancer',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
  {
    id: 2,
    freelancer_id: 42,
    user_id: 2,
    role: 'admin',
    user: {
      id: 2,
      name: 'Alex Admin',
      email: 'alex@studio.test',
      role: 'freelancer',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
  {
    id: 3,
    freelancer_id: 42,
    user_id: 3,
    role: 'member',
    user: {
      id: 3,
      name: 'Morgan Member',
      email: 'morgan@studio.test',
      role: 'freelancer',
      email_verified_at: null,
      ...timestamps,
    },
    ...timestamps,
  },
]

export const pageTwoMember: MemberResource = {
  id: 4,
  freelancer_id: 42,
  user_id: 4,
  role: 'member',
  user: {
    id: 4,
    name: 'Page Two Member',
    email: 'page-two@studio.test',
    role: 'freelancer',
    email_verified_at: null,
    ...timestamps,
  },
  ...timestamps,
}

export const defaultMemberListResponse: MemberListResponse = {
  data: sampleMembers,
  links: {
    first: '/api/v1/members',
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

export const emptyMemberListResponse: MemberListResponse = {
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

export const paginatedMemberListPageOne: MemberListResponse = {
  data: sampleMembers.slice(0, 2),
  links: {
    first: '/api/v1/members',
    last: null,
    prev: null,
    next: '/api/v1/members?cursor=page-2',
  },
  meta: {
    per_page: 25,
    next_cursor: 'page-2',
    prev_cursor: null,
  },
}

export const paginatedMemberListPageTwo: MemberListResponse = {
  data: [pageTwoMember],
  links: {
    first: '/api/v1/members',
    last: null,
    prev: '/api/v1/members',
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: 'page-1',
  },
}
