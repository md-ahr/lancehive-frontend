import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { portalInvoicesResponse } from '@/test/fixtures/portal'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/test-utils'

import { usePortalInvoices } from './usePortalInvoices'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

describe('usePortalInvoices', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns paginated invoices on success', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => usePortalInvoices(), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(portalInvoicesResponse.data.length)
  })

  it('passes status filter to the API', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    let statusParam: string | null = null
    server.use(
      http.get(`${API_BASE_URL}/portal/client-invoices`, ({ request }) => {
        statusParam = new URL(request.url).searchParams.get('status')
        return HttpResponse.json(portalInvoicesResponse)
      }),
    )

    const { result } = renderHook(() => usePortalInvoices({ status: 'sent' }), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(statusParam).toBe('sent')
  })

  it('surfaces error on 500', async () => {
    setToken('client-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    server.use(
      http.get(`${API_BASE_URL}/portal/client-invoices`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => usePortalInvoices(), {
      wrapper: createWrapper({ withPortal: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
