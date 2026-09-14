import { http, HttpResponse } from 'msw'

import {
  emptyPortalInvoicesResponse,
  emptyPortalProjectsResponse,
  portalClientResponse,
  portalInvoicesResponse,
  portalProjectsResponse,
} from '@/test/fixtures/portal'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const portalHandlers = [
  http.get(`${API_BASE_URL}/portal/client`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    return HttpResponse.json(portalClientResponse)
  }),

  http.get(`${API_BASE_URL}/portal/projects`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    if (authorization.includes('empty-portal-projects')) {
      return HttpResponse.json(emptyPortalProjectsResponse)
    }

    const clientId = request.headers.get('X-Client-Id')
    if (clientId) {
      return HttpResponse.json({
        ...portalProjectsResponse,
        data: portalProjectsResponse.data.filter(
          (project) => String(project.client_id) === clientId,
        ),
      })
    }

    return HttpResponse.json(portalProjectsResponse)
  }),

  http.get(`${API_BASE_URL}/portal/client-invoices`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    if (authorization.includes('empty-portal-invoices')) {
      return HttpResponse.json(emptyPortalInvoicesResponse)
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    let data = portalInvoicesResponse.data

    if (status) {
      data = data.filter((invoice) => invoice.status === status)
    }

    return HttpResponse.json({
      ...portalInvoicesResponse,
      data,
    })
  }),
]
