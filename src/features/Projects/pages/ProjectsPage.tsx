import { useMemo, useState } from 'react'

import { FolderKanban, Plus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useClientList } from '@/features/Clients/hooks/useClientList'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import { ProjectFormDialog } from '../components/ProjectFormDialog'
import { ProjectsTable } from '../components/ProjectsTable'
import { useProjectList } from '../hooks/useProjectList'

export function ProjectsPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const canWrite = useCanWrite()
  const projects = useProjectList({ cursor })
  const clients = useClientList()

  const clientNames = useMemo(() => {
    const names: Record<number, string> = {}
    for (const client of clients.data?.data ?? []) {
      names[client.id] = client.name
    }
    return names
  }, [clients.data?.data])

  const createAction = canWrite ? (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create project
    </Button>
  ) : null

  if (projects.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (projects.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Projects"
          description="Track billable work across all clients in your workspace."
          actions={createAction}
        />
        <ErrorAlert error={projects.error} onRetry={() => void projects.refetch()} />
      </div>
    )
  }

  const projectData = projects.data?.data ?? []
  const meta = projects.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Track billable work across all clients in your workspace."
        actions={createAction}
      />

      {projectData.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start tracking tasks and time."
          action={createAction}
        />
      ) : (
        <div className="space-y-4">
          <ProjectsTable projects={projectData} clientNames={clientNames} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}

      <ProjectFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
