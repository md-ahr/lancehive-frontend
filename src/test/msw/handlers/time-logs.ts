import { http, HttpResponse } from 'msw'

import type { CreateTimeLogRequest, UpdateTimeLogRequest } from '@/features/TimeLogs/types'

import {
  emptyTimeLogListResponse,
  projectTimeSummaryResponse,
  sampleTimeLogs,
  taskTimeLogsResponse,
} from '@/test/fixtures/time-logs'

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

export const timeLogsHandlers = [
  http.get(`${API_BASE_URL}/tasks/:taskId/time-logs`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const taskId = Number(params.taskId)
    if (authorization.includes('empty-time-log-list') || taskId === 999) {
      return HttpResponse.json(emptyTimeLogListResponse)
    }

    return HttpResponse.json(taskTimeLogsResponse(taskId))
  }),

  http.post(`${API_BASE_URL}/tasks/:taskId/time-logs`, async ({ request, params }) => {
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

    const body = (await request.json()) as CreateTimeLogRequest

    if (!body.hours) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            hours: ['The hours field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.hours === '0') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            hours: ['Hours must be at least 0.01.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      id: 99,
      task_id: Number(params.taskId),
      user_id: 12,
      hours: body.hours,
      description: body.description ?? null,
      logged_at: body.logged_at,
      client_invoice_item_id: null,
      created_at: '2026-03-01T09:00:00+00:00',
      updated_at: '2026-03-01T09:00:00+00:00',
    }

    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(`${API_BASE_URL}/time-logs/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    const existing = sampleTimeLogs.find((item) => item.id === id)
    if (!existing) {
      return notFound()
    }

    if (existing.client_invoice_item_id !== null) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'Billed time log cannot be edited.',
        },
        { status: 422 },
      )
    }

    const body = (await request.json()) as UpdateTimeLogRequest

    return HttpResponse.json({
      ...existing,
      ...body,
      updated_at: '2026-03-02T09:00:00+00:00',
    })
  }),

  http.delete(`${API_BASE_URL}/time-logs/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    const existing = sampleTimeLogs.find((item) => item.id === id)
    if (!existing) {
      return notFound()
    }

    if (existing.client_invoice_item_id !== null) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'Billed time log cannot be deleted.',
        },
        { status: 422 },
      )
    }

    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API_BASE_URL}/projects/:projectId/time-summary`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const projectId = Number(params.projectId)
    if (authorization.includes('missing-time-summary') || projectId === 999) {
      return notFound()
    }

    return HttpResponse.json(projectTimeSummaryResponse(projectId))
  }),
]
