import { useQuery } from '@tanstack/react-query'

import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'

import type { ClientInvoiceListResponse, InvoiceStatus } from '../types'

import { invoiceKeys } from '../query-keys'

const DEFAULT_PER_PAGE = 25

type UseProjectInvoiceListOptions = {
  projectId: string
  cursor?: string
  status?: InvoiceStatus
}

export function useProjectInvoiceList({ projectId, cursor, status }: UseProjectInvoiceListOptions) {
  const { freelancerId } = useWorkspaceContext()

  return useQuery({
    queryKey: invoiceKeys.projectList(projectId, { cursor, status }),
    queryFn: () => {
      const params = new URLSearchParams({ per_page: String(DEFAULT_PER_PAGE) })
      if (cursor) {
        params.set('cursor', cursor)
      }
      if (status) {
        params.set('status', status)
      }

      return apiRequest<ClientInvoiceListResponse>(
        `/projects/${projectId}/client-invoices?${params.toString()}`,
        { freelancerId },
      )
    },
    enabled: Boolean(freelancerId && projectId),
  })
}
