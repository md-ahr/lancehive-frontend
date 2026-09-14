import { http, HttpResponse } from 'msw'

import type { CreateClientRequest, UpdateClientRequest } from '@/features/Clients/types'

import {
  defaultClientListResponse,
  emptyClientListResponse,
  paginatedClientListPageOne,
  paginatedClientListPageTwo,
  sampleClients,
} from '@/test/fixtures/clients'

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

export const clientsHandlers = [
  http.get(`${API_BASE_URL}/clients`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('empty-list')) {
      return HttpResponse.json(emptyClientListResponse)
    }

    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')

    if (cursor === 'page-2') {
      return HttpResponse.json(paginatedClientListPageTwo)
    }

    if (authorization.includes('paginated-list')) {
      return HttpResponse.json(paginatedClientListPageOne)
    }

    return HttpResponse.json(defaultClientListResponse)
  }),

  http.get(`${API_BASE_URL}/clients/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (authorization.includes('missing-detail') || id === 999) {
      return notFound()
    }

    const client = sampleClients.find((item) => item.id === id)
    if (!client) {
      return notFound()
    }

    return HttpResponse.json(client)
  }),

  http.post(`${API_BASE_URL}/clients`, async ({ request }) => {
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

    const body = (await request.json()) as CreateClientRequest

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

    if (body.name === 'Duplicate Client') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            name: ['A client with this name already exists.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      id: 99,
      name: body.name,
      status: 'active' as const,
      contact_email: body.contact_email ?? null,
      created_at: '2026-03-01T09:00:00+00:00',
      updated_at: '2026-03-01T09:00:00+00:00',
    }

    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(`${API_BASE_URL}/clients/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    const existing = sampleClients.find((item) => item.id === id)
    if (!existing) {
      return notFound()
    }

    const body = (await request.json()) as UpdateClientRequest

    return HttpResponse.json({
      ...existing,
      ...body,
      updated_at: '2026-03-02T09:00:00+00:00',
    })
  }),

  http.delete(`${API_BASE_URL}/clients/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (!sampleClients.find((item) => item.id === id)) {
      return notFound()
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
