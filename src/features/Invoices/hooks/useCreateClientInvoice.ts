import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useIsReadOnly } from '@/features/Workspace/hooks/useIsReadOnly'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { apiRequest } from '@/lib/api'
import { ApiError } from '@/lib/errors'

import type { ClientInvoiceResource, CreateClientInvoiceRequest } from '../types'

import { invoiceKeys } from '../query-keys'

type CreateClientInvoicePayload = CreateClientInvoiceRequest & {
  projectId: string
}

export function useCreateClientInvoice() {
  const queryClient = useQueryClient()
  const { freelancerId } = useWorkspaceContext()
  const isReadOnly = useIsReadOnly()

  return useMutation({
    mutationFn: ({ projectId, ...payload }: CreateClientInvoicePayload) => {
      if (isReadOnly) {
        throw new ApiError(403, { code: 'workspace_read_only' })
      }

      if (!freelancerId) {
        throw new ApiError(403, { code: 'forbidden' })
      }

      return apiRequest<ClientInvoiceResource>(`/projects/${projectId}/client-invoices`, {
        method: 'POST',
        body: JSON.stringify(payload),
        freelancerId,
      })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: invoiceKeys.projectLists(),
      })
      void queryClient.invalidateQueries({
        queryKey: invoiceKeys.projectList(variables.projectId),
      })
    },
  })
}
