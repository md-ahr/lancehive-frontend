import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientInvoiceDetailResource } from '../types'

import { invoiceKeys } from '../query-keys'

export function useClientInvoice(id?: string) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: invoiceKeys.detail(id ?? ''),
    queryFn: () =>
      apiRequest<ClientInvoiceDetailResource>(`/client-invoices/${id}`, { freelancerId }),
    enabled: Boolean(freelancerId && id),
  })
}
