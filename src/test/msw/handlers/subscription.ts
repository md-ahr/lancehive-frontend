import { http, HttpResponse } from 'msw'

import {
  activeSubscription,
  canceledSubscriptionResource,
  checkoutResponse,
  readOnlySubscription,
  trialingSubscription,
} from '@/test/fixtures/subscription'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const subscriptionHandlers = [
  http.get(`${API_BASE_URL}/subscription`, ({ request }) => {
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

    if (authorization.includes('active-subscription')) {
      return HttpResponse.json(activeSubscription)
    }

    if (authorization.includes('read-only-subscription')) {
      return HttpResponse.json(readOnlySubscription)
    }

    return HttpResponse.json(trialingSubscription)
  }),

  http.post(`${API_BASE_URL}/subscription/checkout`, async ({ request }) => {
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

    const body = (await request.json()) as { plan_id?: number; billing_interval?: string }

    if (!body.plan_id || !body.billing_interval) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            plan_id: body.plan_id ? [] : ['The plan id field is required.'],
            billing_interval: body.billing_interval
              ? []
              : ['The billing interval field is required.'],
          },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json(checkoutResponse)
  }),

  http.post(`${API_BASE_URL}/subscription/cancel`, ({ request }) => {
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

    return HttpResponse.json(canceledSubscriptionResource)
  }),

  http.post(`${API_BASE_URL}/subscription/swap`, async ({ request }) => {
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

    const body = (await request.json()) as { plan_id?: number; billing_interval?: string }

    if (!body.plan_id || !body.billing_interval) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            plan_id: body.plan_id ? [] : ['The plan id field is required.'],
            billing_interval: body.billing_interval
              ? []
              : ['The billing interval field is required.'],
          },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json({
      ...activeSubscription,
      plan_id: body.plan_id,
      billing_interval: body.billing_interval,
    })
  }),
]
