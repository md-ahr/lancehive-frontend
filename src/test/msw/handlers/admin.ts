import { http, HttpResponse } from 'msw'

import type {
  CreateFreelancerRequest,
  OverrideSubscriptionRequest,
  UpdateFreelancerRequest,
} from '@/features/Admin/types'
import type { PlanResource } from '@/features/Subscription/types'

import {
  defaultFreelancerListResponse,
  defaultPlanListResponse,
  emptyFreelancerListResponse,
  freelancerDetail,
  overrideSubscriptionResponse,
  proPlan,
  sampleFreelancers,
} from '@/test/fixtures/admin'
import { starterPlan } from '@/test/fixtures/subscription'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

function unauthorized() {
  return HttpResponse.json(
    { code: 'unauthenticated', message: 'Unauthenticated.' },
    { status: 401 },
  )
}

function superAdminRequired() {
  return HttpResponse.json(
    { code: 'super_admin_required', message: 'Super admin required.' },
    { status: 403 },
  )
}

function isSuperAdmin(request: Request) {
  const authorization = request.headers.get('Authorization')
  return Boolean(authorization?.includes('admin'))
}

export const adminHandlers = [
  http.get(`${API_BASE_URL}/admin/freelancers`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    if (authorization.includes('empty-freelancers')) {
      return HttpResponse.json(emptyFreelancerListResponse)
    }

    return HttpResponse.json(defaultFreelancerListResponse)
  }),

  http.get(`${API_BASE_URL}/admin/freelancers/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const freelancer = sampleFreelancers.find((item) => String(item.id) === params.id)
    if (!freelancer) {
      return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
    }

    return HttpResponse.json({
      ...freelancerDetail,
      ...freelancer,
    })
  }),

  http.post(`${API_BASE_URL}/admin/freelancers`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const body = (await request.json()) as CreateFreelancerRequest

    if (!body.workspace_name || !body.owner_name || !body.owner_email) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            owner_email: body.owner_email ? [] : ['The owner email field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.owner_email === 'duplicate@studio.test') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            owner_email: ['The owner email has already been taken.'],
          },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json(
      {
        ...freelancerDetail,
        id: 99,
        name: body.workspace_name,
        slug: body.workspace_name.toLowerCase().replace(/\s+/g, '-'),
        status: 'pending',
        owner: {
          id: 99,
          name: body.owner_name,
          email: body.owner_email,
          role: 'freelancer',
          email_verified_at: null,
          created_at: freelancerDetail.created_at,
          updated_at: freelancerDetail.updated_at,
        },
      },
      { status: 201 },
    )
  }),

  http.patch(`${API_BASE_URL}/admin/freelancers/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const body = (await request.json()) as UpdateFreelancerRequest
    const freelancer = sampleFreelancers.find((item) => String(item.id) === params.id)

    if (!freelancer) {
      return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
    }

    return HttpResponse.json({ ...freelancer, status: body.status })
  }),

  http.post(`${API_BASE_URL}/admin/freelancers/:id/resend-invite`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const freelancer = sampleFreelancers.find((item) => String(item.id) === params.id)
    if (!freelancer) {
      return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
    }

    return HttpResponse.json({ message: 'Invitation resent successfully.' })
  }),

  http.patch(`${API_BASE_URL}/admin/freelancers/:id/subscription`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const body = (await request.json()) as OverrideSubscriptionRequest
    const freelancer = sampleFreelancers.find((item) => String(item.id) === params.id)

    if (!freelancer) {
      return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
    }

    if (!body.plan_id) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { plan_id: ['The plan id field is required.'] },
        },
        { status: 422 },
      )
    }

    const plan = body.plan_id === proPlan.id ? proPlan : starterPlan

    return HttpResponse.json({
      ...overrideSubscriptionResponse,
      freelancer_id: Number(params.id),
      plan_id: body.plan_id,
      provider: body.provider ?? 'manual',
      plan,
    })
  }),

  http.get(`${API_BASE_URL}/admin/plans`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    if (authorization.includes('empty-plans')) {
      return HttpResponse.json({ data: [] })
    }

    return HttpResponse.json(defaultPlanListResponse)
  }),

  http.post(`${API_BASE_URL}/admin/plans`, async ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const body = (await request.json()) as Partial<PlanResource>

    if (!body.name || !body.slug) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: {
            slug: body.slug ? [] : ['The slug field is required.'],
          },
        },
        { status: 422 },
      )
    }

    if (body.slug === 'starter') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { slug: ['The slug has already been taken.'] },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json(
      {
        id: 3,
        name: body.name,
        slug: body.slug,
        price_monthly: body.price_monthly ?? null,
        price_yearly: body.price_yearly ?? null,
        currency: body.currency ?? 'BDT',
        max_clients: body.max_clients ?? null,
        max_projects: body.max_projects ?? null,
        max_team_members: body.max_team_members ?? null,
        is_custom: body.is_custom ?? false,
        is_active: body.is_active ?? true,
        sort_order: body.sort_order ?? 3,
        created_at: starterPlan.created_at,
        updated_at: starterPlan.updated_at,
      },
      { status: 201 },
    )
  }),

  http.patch(`${API_BASE_URL}/admin/plans/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return unauthorized()
    }

    if (!isSuperAdmin(request)) {
      return superAdminRequired()
    }

    const plan = defaultPlanListResponse.data.find((item) => String(item.id) === params.id)
    if (!plan) {
      return HttpResponse.json({ code: 'not_found', message: 'Not found.' }, { status: 404 })
    }

    const body = (await request.json()) as Partial<PlanResource>
    return HttpResponse.json({ ...plan, ...body })
  }),
]
