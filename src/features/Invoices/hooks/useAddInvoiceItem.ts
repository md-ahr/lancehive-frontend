import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { AddInvoiceItemRequest, ClientInvoiceItemResource } from '../types'

import { invoiceKeys } from '../query-keys'

type AddInvoiceItemPayload = AddInvoiceItemRequest & {
  invoiceId: string
}

export function useAddInvoiceItem() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ invoiceId, ...payload }: AddInvoiceItemPayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientInvoiceItemResource>(`/client-invoices/${invoiceId}/items`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(variables.invoiceId) })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.projectLists() })
    },
  })
}
