import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { invoiceKeys } from '../query-keys'
import { useUpdateClientInvoice } from './useUpdateClientInvoice'

function useUpdateClientInvoiceProbe() {
  const context = useWorkspaceContext()
  const mutation = useUpdateClientInvoice()

  return { context, mutation }
}

describe('useUpdateClientInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('marks invoice as sent and invalidates detail', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: invoiceKeys.detail('50') })

    const { result } = renderHook(() => useUpdateClientInvoiceProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    const updated = await result.current.mutation.mutateAsync({
      id: '50',
      status: 'sent',
    })

    expect(updated.status).toBe('sent')
    await waitFor(() => {
      expect(queryClient.getQueryState(invoiceKeys.detail('50'))?.isInvalidated).toBe(true)
    })
  })
})
