import { http, HttpResponse } from 'msw'

import type {
  AddInvoiceItemRequest,
  CreateClientInvoiceRequest,
  RecordInvoicePaymentRequest,
  UpdateClientInvoiceRequest,
} from '@/features/Invoices/types'

import {
  defaultInvoiceListResponse,
  emptyInvoiceListResponse,
  paginatedInvoiceListPageOne,
  paginatedInvoiceListPageTwo,
  projectInvoicesResponse,
  sampleDraftInvoice,
  sampleDraftInvoiceDetail,
  samplePaidInvoiceDetail,
  sampleSentInvoiceDetail,
} from '@/test/fixtures/invoices'

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

function listResponse(request: Request) {
  const authorization = request.headers.get('Authorization')
  if (!authorization) {
    return unauthorized()
  }

  const freelancerId = request.headers.get('X-Freelancer-Id')
  if (!freelancerId) {
    return missingFreelancerContext()
  }

  if (authorization.includes('empty-invoice-list')) {
    return HttpResponse.json(emptyInvoiceListResponse)
  }

  const url = new URL(request.url)
  const cursor = url.searchParams.get('cursor')
  const status = url.searchParams.get('status')

  if (cursor === 'page-2') {
    return HttpResponse.json(paginatedInvoiceListPageTwo)
  }

  if (authorization.includes('paginated-invoice-list')) {
    return HttpResponse.json(paginatedInvoiceListPageOne)
  }

  if (status) {
    const filtered = defaultInvoiceListResponse.data.filter((invoice) => invoice.status === status)
    return HttpResponse.json({
      ...defaultInvoiceListResponse,
      data: filtered,
    })
  }

  return HttpResponse.json(defaultInvoiceListResponse)
}

export const invoicesHandlers = [
  http.get(`${API_BASE_URL}/client-invoices`, ({ request }) => listResponse(request)),

  http.get(`${API_BASE_URL}/projects/:projectId/client-invoices`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const projectId = Number(params.projectId)
    if (authorization.includes('empty-invoice-list') || projectId === 999) {
      return HttpResponse.json(emptyInvoiceListResponse)
    }

    return HttpResponse.json(projectInvoicesResponse(projectId))
  }),

  http.get(`${API_BASE_URL}/client-invoices/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const id = Number(params.id)
    if (authorization.includes('missing-invoice-detail') || id === 999) {
      return notFound()
    }

    if (id === 51) {
      return HttpResponse.json(sampleSentInvoiceDetail)
    }

    if (id === 52) {
      return HttpResponse.json(samplePaidInvoiceDetail)
    }

    return HttpResponse.json(sampleDraftInvoiceDetail)
  }),

  http.post(`${API_BASE_URL}/projects/:projectId/client-invoices`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const body = (await request.json()) as CreateClientInvoiceRequest
    const projectId = Number(params.projectId)

    return HttpResponse.json(
      {
        ...sampleDraftInvoice,
        id: 60,
        project_id: projectId,
        prefill_unbilled_time: body.prefill_unbilled_time ?? false,
      },
      { status: 201 },
    )
  }),

  http.patch(`${API_BASE_URL}/client-invoices/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const body = (await request.json()) as UpdateClientInvoiceRequest
    const id = Number(params.id)

    if (body.status === 'sent') {
      return HttpResponse.json({
        ...sampleDraftInvoice,
        id,
        status: 'sent',
        issued_at: '2026-03-10',
        sent_at: '2026-03-10T12:00:00+00:00',
      })
    }

    return HttpResponse.json({
      ...sampleDraftInvoice,
      id,
      ...body,
    })
  }),

  http.delete(`${API_BASE_URL}/client-invoices/:id`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${API_BASE_URL}/client-invoices/:id/items`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const body = (await request.json()) as AddInvoiceItemRequest
    const quantity = Number(body.quantity)
    const rate = Number(body.rate)

    return HttpResponse.json(
      {
        id: 99,
        description: body.description,
        quantity: body.quantity,
        rate: body.rate,
        amount: (quantity * rate).toFixed(2),
        created_at: '2026-03-10T10:00:00+00:00',
        updated_at: '2026-03-10T10:00:00+00:00',
      },
      { status: 201 },
    )
  }),

  http.post(`${API_BASE_URL}/client-invoices/:id/payments`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    const freelancerId = request.headers.get('X-Freelancer-Id')
    if (!freelancerId) {
      return missingFreelancerContext()
    }

    const body = (await request.json()) as RecordInvoicePaymentRequest

    return HttpResponse.json(
      {
        id: 10,
        amount: body.amount,
        payment_method: body.payment_method,
        reference: body.reference ?? null,
        paid_at: body.paid_at,
        notes: body.notes ?? null,
        created_at: '2026-03-10T10:00:00+00:00',
        updated_at: '2026-03-10T10:00:00+00:00',
      },
      { status: 201 },
    )
  }),
]
