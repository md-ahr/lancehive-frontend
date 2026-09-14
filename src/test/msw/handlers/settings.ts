import { http, HttpResponse } from 'msw'

import { defaultUserSettings, defaultWorkspaceSettings } from '@/test/fixtures/settings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const settingsHandlers = [
  http.get(`${API_BASE_URL}/me/settings`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    return HttpResponse.json(defaultUserSettings)
  }),

  http.patch(`${API_BASE_URL}/me/settings`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    const body = (await request.json()) as Record<string, unknown>

    if (body.timezone === 'Invalid/Timezone') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { timezone: ['The timezone field is invalid.'] },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json({
      ...defaultUserSettings,
      ...body,
      notification_preferences: {
        ...defaultUserSettings.notification_preferences,
        ...(body.notification_preferences as object | undefined),
      },
    })
  }),

  http.get(`${API_BASE_URL}/workspace/settings`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 })
    }

    return HttpResponse.json(defaultWorkspaceSettings)
  }),

  http.patch(`${API_BASE_URL}/workspace/settings`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 })
    }

    if (authorization.includes('member-only')) {
      return HttpResponse.json({ code: 'forbidden', message: 'Forbidden.' }, { status: 403 })
    }

    if (authorization.includes('read-only')) {
      return HttpResponse.json(
        { code: 'workspace_read_only', message: 'Workspace is read-only.' },
        { status: 403 },
      )
    }

    const body = (await request.json()) as Record<string, unknown>

    return HttpResponse.json({
      ...defaultWorkspaceSettings,
      ...body,
    })
  }),
]
