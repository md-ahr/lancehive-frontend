import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientInvoiceListResponse, InvoiceStatus } from '../types'

import { invoiceKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseClientInvoiceListOptions = {
  cursor?: string
  status?: InvoiceStatus
}

export function useClientInvoiceList({ cursor, status }: UseClientInvoiceListOptions = {}) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: invoiceKeys.list({ cursor, status }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<ClientInvoiceListResponse>(`/client-invoices?${params.toString()}`, {
        freelancerId,
      })
    },
    enabled: Boolean(freelancerId),
  })
}
