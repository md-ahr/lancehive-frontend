import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { setToken } from '@/lib/auth-storage'
import { createWrapper } from '@/test/test-utils'

import { invoiceKeys } from '../query-keys'
import { useVoidClientInvoice } from './useVoidClientInvoice'

function useVoidClientInvoiceProbe() {
  const context = useWorkspaceContext()
  const mutation = useVoidClientInvoice()

  return { context, mutation }
}

describe('useVoidClientInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ hasToken: false, isHydrated: true })
  })

  it('voids draft invoice and invalidates lists', async () => {
    setToken('test-token')
    useAuthStore.setState({ hasToken: true, isHydrated: true })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await queryClient.prefetchQuery({ queryKey: invoiceKeys.list() })
    await queryClient.prefetchQuery({ queryKey: invoiceKeys.projectList('20') })

    const { result } = renderHook(() => useVoidClientInvoiceProbe(), {
      wrapper: createWrapper({ queryClient, withWorkspace: true }),
    })

    await waitFor(() => expect(result.current.context.freelancerId).toBe('42'))

    await result.current.mutation.mutateAsync({ id: '50', projectId: '20' })

    await waitFor(() => {
      expect(queryClient.getQueryState(invoiceKeys.list())?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(invoiceKeys.projectList('20'))?.isInvalidated).toBe(true)
    })
  })
})
