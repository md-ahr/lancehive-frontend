import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'

import { ApiError } from '../errors/errors'
import { apiRequest } from './api'

function matchesApiPath(path: string) {
  return ({ request }: { request: Request }) => new URL(request.url).pathname.endsWith(path)
}

describe('apiRequest', () => {
  it('returns parsed JSON on success', async () => {
    server.use(http.get(matchesApiPath('/health'), () => HttpResponse.json({ status: 'ok' })))

    const result = await apiRequest<{ status: string }>('/health')
    expect(result.status).toBe('ok')
  })

  it('throws ApiError with status and body on failure', async () => {
    server.use(
      http.get(matchesApiPath('/fail'), () =>
        HttpResponse.json({ code: 'not_found', message: 'Missing' }, { status: 404 }),
      ),
    )

    await expect(apiRequest('/fail')).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(ApiError)
      const apiError = error as ApiError
      expect(apiError.status).toBe(404)
      expect(apiError.body).toEqual({ code: 'not_found', message: 'Missing' })
      return true
    })
  })
})
