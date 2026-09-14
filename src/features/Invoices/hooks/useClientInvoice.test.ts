import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { useClientInvoice } from './useClientInvoice'

describe('useClientInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('returns invoice detail with items and balance', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useClientInvoice('50'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.invoice_number).toBe('INV-2026-0001')
    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.outstanding_balance).toBe('7500.00')
  })

  it('surfaces 404 for missing invoice', async () => {
    setToken('missing-invoice-detail')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const { result } = renderHook(() => useClientInvoice('999'), {
      wrapper: createWrapper({ withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
