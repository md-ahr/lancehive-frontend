import { useMemo } from 'react'

import { Link, useParams } from 'react-router-dom'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClientList } from '@/features/Clients/hooks/useClientList'
import { ProjectTasksTab } from '@/features/Tasks/components/ProjectTasksTab'
import { ApiError, getErrorCode } from '@/lib/errors'

import { ProjectHeader } from '../components/ProjectHeader'
import { useProject } from '../hooks/useProject'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const projectQuery = useProject(id)
  const clients = useClientList()

  const clientName = useMemo(() => {
    const clientId = projectQuery.data?.client_id
    if (!clientId) {
      return undefined
    }

    return clients.data?.data.find((client) => client.id === clientId)?.name
  }, [clients.data?.data, projectQuery.data?.client_id])

  if (projectQuery.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (projectQuery.isError) {
    const isNotFound =
      (projectQuery.error instanceof ApiError && projectQuery.error.status === 404) ||
      getErrorCode(projectQuery.error) === 'not_found'

    if (isNotFound) {
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            <Link className="text-primary hover:underline" to="/app/projects">
              Back to projects
            </Link>
          </p>
          <div className="border-border bg-card space-y-2 border p-6">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Project not found</h1>
            <p className="text-muted-foreground text-sm">
              This project does not exist or is not available in your workspace.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <ErrorAlert error={projectQuery.error} onRetry={() => void projectQuery.refetch()} />
      </div>
    )
  }

  const project = projectQuery.data
  if (!project) {
    return null
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        <Link className="text-primary hover:underline" to="/app/projects">
          Back to projects
        </Link>
        {clientName ? (
          <>
            {' '}
            ·{' '}
            <Link className="text-primary hover:underline" to={`/app/clients/${project.client_id}`}>
              {clientName}
            </Link>
          </>
        ) : null}
      </p>

      <ProjectHeader project={project} clientName={clientName} />

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <ProjectTasksTab projectId={project.id} />
        </TabsContent>
        <TabsContent value="time">
          <div className="border-border bg-card text-muted-foreground border p-6 text-sm">
            Time logs and summary for this project will appear here.
          </div>
        </TabsContent>
        <TabsContent value="invoices">
          <div className="border-border bg-card text-muted-foreground border p-6 text-sm">
            Invoices for this project will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
