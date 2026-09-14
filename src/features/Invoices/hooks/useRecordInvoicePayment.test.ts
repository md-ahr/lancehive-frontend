import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { invoiceKeys } from '../query-keys'
import { useRecordInvoicePayment } from './useRecordInvoicePayment'

function useRecordInvoicePaymentProbe() {
  const context = useWorkspaceContext()
  const mutation = useRecordInvoicePayment()

  return { context, mutation }
}

describe('useRecordInvoicePayment', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('records payment and invalidates invoice detail', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: invoiceKeys.detail('51') })

    const { result } = renderHook(() => useRecordInvoicePaymentProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const payment = await result.current.mutation.mutateAsync({
      invoiceId: '51',
      amount: '5000.00',
      payment_method: 'bank_transfer',
      paid_at: '2026-03-10T12:00:00+00:00',
    })

    expect(payment.amount).toBe('5000.00')
    await waitFor(() => {
      expect(queryClient.getQueryState(invoiceKeys.detail('51'))?.isInvalidated).toBe(true)
    })
  })
})
