import { useMemo, useState } from 'react'

import { FolderKanban, Plus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'

import { useClientProjects } from '../hooks/useClientProjects'
import { ProjectFormDialog } from './ProjectFormDialog'
import { ProjectsTable } from './ProjectsTable'

type ClientProjectsTabProps = {
  clientId: number
}

export function ClientProjectsTab({ clientId }: ClientProjectsTabProps) {
  const [cursor, setCursor] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const canWrite = useCanWrite()
  const projects = useClientProjects({ clientId: String(clientId), cursor })

  const createAction = canWrite ? (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create project
    </Button>
  ) : null

  const projectData = useMemo(() => projects.data?.data ?? [], [projects.data?.data])
  const meta = projects.data?.meta

  if (projects.isPending) {
    return <LoadingSkeleton variant="table" />
  }

  if (projects.isError) {
    return <ErrorAlert error={projects.error} onRetry={() => void projects.refetch()} />
  }

  if (projectData.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create the first project for this client."
          action={createAction}
        />
        <ProjectFormDialog clientId={clientId} open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{createAction}</div>
      <ProjectsTable projects={projectData} />
      {meta ? (
        <CursorPagination
          meta={meta}
          onNext={() => setCursor(meta.next_cursor ?? undefined)}
          onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
        />
      ) : null}
      <ProjectFormDialog clientId={clientId} open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
