import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { invoiceKeys } from '../query-keys'
import { useAddInvoiceItem } from './useAddInvoiceItem'

function useAddInvoiceItemProbe() {
  const context = useWorkspaceContext()
  const mutation = useAddInvoiceItem()

  return { context, mutation }
}

describe('useAddInvoiceItem', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('adds item and invalidates invoice detail', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: invoiceKeys.detail('50') })

    const { result } = renderHook(() => useAddInvoiceItemProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const item = await result.current.mutation.mutateAsync({
      invoiceId: '50',
      description: 'Extra work',
      quantity: '2',
      rate: '1500.00',
    })

    expect(item.amount).toBe('3000.00')
    await waitFor(() => {
      expect(queryClient.getQueryState(invoiceKeys.detail('50'))?.isInvalidated).toBe(true)
    })
  })
})
