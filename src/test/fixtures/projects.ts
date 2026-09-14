import type { ProjectListResponse, ProjectResource } from '@/features/Projects/types'

const timestamps = {
  created_at: '2026-02-01T10:00:00+00:00',
  updated_at: '2026-02-01T10:00:00+00:00',
}

export const sampleProjects: ProjectResource[] = [
  {
    id: 20,
    client_id: 10,
    name: 'Website Redesign',
    hourly_rate: '1500.00',
    currency: 'BDT',
    status: 'active',
    deadline: '2026-06-30',
    ...timestamps,
  },
  {
    id: 21,
    client_id: 10,
    name: 'Mobile App',
    hourly_rate: '1800.00',
    currency: 'BDT',
    status: 'on_hold',
    deadline: null,
    ...timestamps,
  },
  {
    id: 22,
    client_id: 11,
    name: 'Brand Refresh',
    hourly_rate: '1200.00',
    currency: 'BDT',
    status: 'completed',
    deadline: '2026-03-15',
    ...timestamps,
  },
]

export const pageTwoProject: ProjectResource = {
  id: 23,
  client_id: 12,
  name: 'Page Two Project',
  hourly_rate: '900.00',
  currency: 'BDT',
  status: 'active',
  deadline: null,
  ...timestamps,
}

export const defaultProjectListResponse: ProjectListResponse = {
  data: sampleProjects,
  links: {
    first: '/api/v1/projects',
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

export const emptyProjectListResponse: ProjectListResponse = {
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

export const paginatedProjectListPageOne: ProjectListResponse = {
  data: sampleProjects.slice(0, 2),
  links: {
    first: '/api/v1/projects',
    last: null,
    prev: null,
    next: '/api/v1/projects?cursor=page-2',
  },
  meta: {
    per_page: 25,
    next_cursor: 'page-2',
    prev_cursor: null,
  },
}

export const paginatedProjectListPageTwo: ProjectListResponse = {
  data: [pageTwoProject],
  links: {
    first: '/api/v1/projects',
    last: null,
    prev: '/api/v1/projects',
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: 'page-1',
  },
}

export function clientProjectsResponse(clientId: number): ProjectListResponse {
  return {
    data: sampleProjects.filter((project) => project.client_id === clientId),
    links: {
      first: `/api/v1/clients/${clientId}/projects`,
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
}
