import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ClientInvoiceResource, UpdateClientInvoiceRequest } from '../types'

import { invoiceKeys } from '../query-keys'

type UpdateClientInvoicePayload = UpdateClientInvoiceRequest & {
  id: string
}

export function useUpdateClientInvoice() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateClientInvoicePayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientInvoiceResource>(`/client-invoices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.projectLists() })
      void queryClient.invalidateQueries({
        queryKey: invoiceKeys.projectList(String(data.project_id)),
      })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(String(data.id)) })
    },
  })
}
