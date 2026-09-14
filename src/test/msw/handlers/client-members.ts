import { http, HttpResponse } from 'msw'

import type { InviteClientMemberRequest } from '@/features/Clients/types'

import {
  defaultClientMemberListResponse,
  emptyClientMemberListResponse,
  paginatedClientMemberListPageOne,
  paginatedClientMemberListPageTwo,
  sampleClientMembers,
} from '@/test/fixtures/client-members'

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

export const clientMembersHandlers = [
  http.get(`${API_BASE_URL}/clients/:clientId/members`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('empty-portal-members')) {
      return HttpResponse.json(emptyClientMemberListResponse)
    }

    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')

    if (cursor === 'page-2') {
      return HttpResponse.json(paginatedClientMemberListPageTwo)
    }

    if (authorization.includes('paginated-portal-members')) {
      return HttpResponse.json(paginatedClientMemberListPageOne)
    }

    return HttpResponse.json(defaultClientMemberListResponse)
  }),

  http.post(`${API_BASE_URL}/clients/:clientId/members`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('member-only')) {
      return HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 })
    }

    const body = (await request.json()) as InviteClientMemberRequest

    if (!body.name || !body.email || !body.role) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            email: ['The email field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.email === 'duplicate@bigco.com') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            email: ['This user already has access to the client portal.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      ...sampleClientMembers[1],
      id: 99,
      role: body.role,
      user: {
        ...sampleClientMembers[1].user!,
        name: body.name,
        email: body.email,
      },
    }

    return HttpResponse.json(created, { status: 201 })
  }),
]
