import { http, HttpResponse } from 'msw'

import { makeLoginResponse, makeMeResponse } from '@/test/fixtures/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const authHandlers = [
  http.post(`${API_BASE_URL}/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }

    if (!body.email || !body.password) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { email: ['The email field is required.'] },
        },
        { status: 422 },
      )
    }

    if (body.password === 'wrong-password') {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { email: ['These credentials do not match our records.'] },
        },
        { status: 422 },
      )
    }

    const role =
      body.email === 'admin@example.com'
        ? 'super_admin'
        : body.email === 'client@example.com'
          ? 'client'
          : 'freelancer'

    return HttpResponse.json(makeLoginResponse(role))
  }),

  http.post(`${API_BASE_URL}/logout`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    return HttpResponse.json({ message: 'Logged out successfully.' })
  }),

  http.get(`${API_BASE_URL}/me`, ({ request }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    if (authorization.includes('invalid')) {
      return HttpResponse.json(
        { code: 'unauthenticated', message: 'Unauthenticated.' },
        { status: 401 },
      )
    }

    if (authorization.includes('client')) {
      return HttpResponse.json(makeMeResponse('client'))
    }

    if (authorization.includes('admin')) {
      return HttpResponse.json(makeMeResponse('super_admin'))
    }

    return HttpResponse.json(makeMeResponse('freelancer'))
  }),

  http.post(`${API_BASE_URL}/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as { email?: string }

    if (!body.email) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { email: ['The email field is required.'] },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json({
      message: 'If your email is registered, you will receive a password reset link shortly.',
    })
  }),

  http.post(`${API_BASE_URL}/reset-password`, async ({ request }) => {
    const body = (await request.json()) as {
      token?: string
      email?: string
      password?: string
      password_confirmation?: string
    }

    if (!body.token || !body.email || !body.password || !body.password_confirmation) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { token: ['The token field is required.'] },
        },
        { status: 422 },
      )
    }

    if (body.password !== body.password_confirmation) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          message: 'The given data was invalid.',
          errors: { password_confirmation: ['The password confirmation does not match.'] },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json({ message: 'Your password has been reset.' })
  }),
]
