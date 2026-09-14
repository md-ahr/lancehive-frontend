import { useState } from 'react'

import { Building2, Plus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import { ClientFormDialog } from '../components/ClientFormDialog'
import { ClientsTable } from '../components/ClientsTable'
import { useClientList } from '../hooks/useClientList'

export function ClientsPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const canWrite = useCanWrite()
  const clients = useClientList(cursor)

  const createAction = canWrite ? (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create client
    </Button>
  ) : null

  if (clients.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (clients.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Clients"
          description="Manage client organizations in your workspace."
          actions={createAction}
        />
        <ErrorAlert error={clients.error} onRetry={() => void clients.refetch()} />
      </div>
    )
  }

  const clientData = clients.data?.data ?? []
  const meta = clients.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage client organizations in your workspace."
        actions={createAction}
      />

      {clientData.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clients yet"
          description="Create your first client to start tracking projects and invoices."
          action={createAction}
        />
      ) : (
        <div className="space-y-4">
          <ClientsTable clients={clientData} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}

      <ClientFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
