import { useState } from 'react'

import { Pencil, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientProjectsTab } from '@/features/Projects/components/ClientProjectsTab'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { ApiError, getErrorCode } from '@/lib/errors'

import { ClientFormDialog } from '../components/ClientFormDialog'
import { ClientHeader } from '../components/ClientHeader'
import { ClientMembersTab } from '../components/ClientMembersTab'
import { DeleteClientDialog } from '../components/DeleteClientDialog'
import { useClient } from '../hooks/useClient'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const canWrite = useCanWrite()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const clientQuery = useClient(id)

  if (clientQuery.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (clientQuery.isError) {
    const isNotFound =
      (clientQuery.error instanceof ApiError && clientQuery.error.status === 404) ||
      getErrorCode(clientQuery.error) === 'not_found'

    if (isNotFound) {
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            <Link className="text-primary hover:underline" to="/app/clients">
              Back to clients
            </Link>
          </p>
          <div className="border-border bg-card space-y-2 border p-6">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Client not found</h1>
            <p className="text-muted-foreground text-sm">
              This client does not exist or is not available in your workspace.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <ErrorAlert error={clientQuery.error} onRetry={() => void clientQuery.refetch()} />
      </div>
    )
  }

  const client = clientQuery.data
  if (!client) {
    return null
  }

  const headerActions =
    canWrite && client.status === 'active' ? (
      <>
        <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" />
          Archive
        </Button>
      </>
    ) : null

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        <Link className="text-primary hover:underline" to="/app/clients">
          Back to clients
        </Link>
      </p>

      <ClientHeader client={client} actions={headerActions} />

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <ClientProjectsTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="members">
          <ClientMembersTab clientId={client.id} />
        </TabsContent>
      </Tabs>

      <ClientFormDialog client={client} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteClientDialog client={client} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
