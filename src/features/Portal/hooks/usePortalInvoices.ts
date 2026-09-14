import { useQuery } from '@tanstack/react-query'

import type { InvoiceStatus } from '@/features/Invoices/types'

import { apiRequest } from '@/lib/api'

import type { PortalInvoiceListResponse } from '../types'

import { portalKeys } from '../query-keys'
import { usePortalContext } from './usePortalContext'

const DEFAULT_PER_PAGE = 25

type UsePortalInvoicesOptions = {
  cursor?: string
  status?: InvoiceStatus
}

export function usePortalInvoices({ cursor, status }: UsePortalInvoicesOptions = {}) {
  const { clientId } = usePortalContext()

  return useQuery({
    queryKey: portalKeys.invoiceList({ cursor, status }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<PortalInvoiceListResponse>(`/portal/client-invoices?${params.toString()}`, {
        clientId,
      })
    },
    enabled: Boolean(clientId),
  })
}
