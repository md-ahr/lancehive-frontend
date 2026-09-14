import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { sampleInvoices } from '@/test/fixtures/invoices'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { useClientInvoiceList } from './useClientInvoiceList'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('useClientInvoiceList', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns paginated invoices with freelancer header', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedHeader: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/client-invoices`, ({ request }) => {
        capturedHeader = request.headers.get('X-Freelancer-Id')
        return HttpResponse.json({
          data: sampleInvoices,
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    const { result } = renderHook(() => useClientInvoiceList(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(3)
    expect(capturedHeader).toBe('42')
  })

  it('passes cursor and status query params', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let capturedStatus: string | null = null
    let capturedCursor: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/client-invoices`, ({ request }) => {
        const url = new URL(request.url)
        capturedStatus = url.searchParams.get('status')
        capturedCursor = url.searchParams.get('cursor')
        return HttpResponse.json({
          data: [],
          meta: { per_page: 25, next_cursor: null, prev_cursor: null },
          links: {},
        })
      }),
    )

    const { result } = renderHook(
      () => useClientInvoiceList({ cursor: 'page-2', status: 'draft' }),
      {
        wrapper: createWrapper({ withWorkspace: true }),
      },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(capturedCursor).toBe('page-2')
    expect(capturedStatus).toBe('draft')
  })

  it('surfaces error on 500', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/client-invoices`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useClientInvoiceList(), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
