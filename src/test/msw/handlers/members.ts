import { http, HttpResponse } from 'msw'

import type { InviteMemberRequest } from '@/features/Members/types'

import {
  defaultMemberListResponse,
  emptyMemberListResponse,
  paginatedMemberListPageOne,
  paginatedMemberListPageTwo,
  sampleMembers,
} from '@/test/fixtures/members'

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

export const membersHandlers = [
  http.get(`${API_BASE_URL}/members`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    if (authorization.includes('empty-members')) {
      return HttpResponse.json(emptyMemberListResponse)
    }

    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')

    if (cursor === 'page-2') {
      return HttpResponse.json(paginatedMemberListPageTwo)
    }

    if (authorization.includes('paginated-members')) {
      return HttpResponse.json(paginatedMemberListPageOne)
    }

    return HttpResponse.json(defaultMemberListResponse)
  }),

  http.post(`${API_BASE_URL}/members`, async ({ request }) => {
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

    const body = (await request.json()) as InviteMemberRequest

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

    if (body.email === 'duplicate@studio.test') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            email: ['This user is already a member of the workspace.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      ...sampleMembers[2],
      id: 99,
      role: body.role,
      user: {
        ...sampleMembers[2].user!,
        name: body.name,
        email: body.email,
      },
    }

    return HttpResponse.json(created, { status: 201 })
  }),
]
