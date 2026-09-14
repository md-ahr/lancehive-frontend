import { http, HttpResponse } from 'msw'

import type { CreateProjectRequest, UpdateProjectRequest } from '@/features/Projects/types'

import {
  clientProjectsResponse,
  defaultProjectListResponse,
  emptyProjectListResponse,
  paginatedProjectListPageOne,
  paginatedProjectListPageTwo,
  sampleProjects,
} from '@/test/fixtures/projects'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function unauthorized() {
  return HttpResponse.json(
    { code: 'unauthenticated', message: 'Unauthenticated.' },
    { status: 401 },
  )
}

function missingFreelancerContext() {
  return HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 })
}

function notFound() {
  return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
}

export const projectsHandlers = [
  http.get(`${API_BASE_URL}/projects`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('empty-project-list')) {
      return HttpResponse.json(emptyProjectListResponse)
    }

    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')

    if (cursor === 'page-2') {
      return HttpResponse.json(paginatedProjectListPageTwo)
    }

    if (authorization.includes('paginated-project-list')) {
      return HttpResponse.json(paginatedProjectListPageOne)
    }

    return HttpResponse.json(defaultProjectListResponse)
  }),

  http.get(`${API_BASE_URL}/clients/:clientId/projects`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const clientId = Number(params.clientId)
    if (authorization.includes('empty-project-list') || clientId === 999) {
      return HttpResponse.json(emptyProjectListResponse)
    }

    return HttpResponse.json(clientProjectsResponse(clientId))
  }),

  http.get(`${API_BASE_URL}/projects/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (authorization.includes('missing-project-detail') || id === 999) {
      return notFound()
    }

    const project = sampleProjects.find((item) => item.id === id)
    if (!project) {
      return notFound()
    }

    return HttpResponse.json(project)
  }),

  http.post(`${API_BASE_URL}/clients/:clientId/projects`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('read-only-workspace')) {
      return HttpResponse.json(
        { code: 'workspace_read_only', message: 'Workspace is read-only.' },
        { status: 403 },
      )
    }

    const body = (await request.json()) as CreateProjectRequest

    if (!body.name) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            name: ['The name field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.name === 'Duplicate Project') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            name: ['A project with this name already exists.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      id: 99,
      client_id: Number(params.clientId),
      name: body.name,
      hourly_rate: body.hourly_rate,
      currency: body.currency ?? 'BDT',
      status: body.status ?? ('active' as const),
      deadline: body.deadline ?? null,
      created_at: '2026-03-01T09:00:00+00:00',
      updated_at: '2026-03-01T09:00:00+00:00',
    }

    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(`${API_BASE_URL}/projects/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    const existing = sampleProjects.find((item) => item.id === id)
    if (!existing) {
      return notFound()
    }

    const body = (await request.json()) as UpdateProjectRequest

    return HttpResponse.json({
      ...existing,
      ...body,
      updated_at: '2026-03-02T09:00:00+00:00',
    })
  }),

  http.delete(`${API_BASE_URL}/projects/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (!sampleProjects.find((item) => item.id === id)) {
      return notFound()
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
