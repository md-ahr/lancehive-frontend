import { http, HttpResponse } from 'msw'

import type { CreateTaskRequest, UpdateTaskRequest } from '@/features/Tasks/types'

import { emptyTaskListResponse, projectTasksResponse, sampleTasks } from '@/test/fixtures/tasks'

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

export const tasksHandlers = [
  http.get(`${API_BASE_URL}/projects/:projectId/tasks`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const projectId = Number(params.projectId)
    if (authorization.includes('empty-task-list') || projectId === 999) {
      return HttpResponse.json(emptyTaskListResponse)
    }

    return HttpResponse.json(projectTasksResponse(projectId))
  }),

  http.get(`${API_BASE_URL}/tasks/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (authorization.includes('missing-task-detail') || id === 999) {
      return notFound()
    }

    const task = sampleTasks.find((item) => item.id === id)
    if (!task) {
      return notFound()
    }

    return HttpResponse.json(task)
  }),

  http.post(`${API_BASE_URL}/projects/:projectId/tasks`, async ({ request, params }) => {
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

    const body = (await request.json()) as CreateTaskRequest

    if (!body.title) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            title: ['The title field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.title === 'Duplicate Task') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            title: ['A task with this title already exists.'],
          },
        },
        { status: 422 },
      )
    }

    const created = {
      id: 99,
      project_id: Number(params.projectId),
      title: body.title,
      status: body.status ?? ('todo' as const),
      due_date: body.due_date ?? null,
      estimated_hours: body.estimated_hours ?? null,
      created_at: '2026-03-01T09:00:00+00:00',
      updated_at: '2026-03-01T09:00:00+00:00',
    }

    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    const existing = sampleTasks.find((item) => item.id === id)
    if (!existing) {
      return notFound()
    }

    const body = (await request.json()) as UpdateTaskRequest

    return HttpResponse.json({
      ...existing,
      ...body,
      updated_at: '2026-03-02T09:00:00+00:00',
    })
  }),

  http.delete(`${API_BASE_URL}/tasks/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (!sampleTasks.find((item) => item.id === id)) {
      return notFound()
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
