import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import { invoiceKeys } from '../query-keys'

type VoidClientInvoicePayload = {
  id: string
  projectId: string
}

export function useVoidClientInvoice() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ id }: VoidClientInvoicePayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<void>(`/client-invoices/${id}`, {
        method: 'DELETE',
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.projectLists() })
      void queryClient.invalidateQueries({
        queryKey: invoiceKeys.projectList(variables.projectId),
      })
      void queryClient.removeQueries({ queryKey: invoiceKeys.detail(variables.id) })
    },
  })
}
