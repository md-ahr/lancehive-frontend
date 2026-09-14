import { useState } from 'react'

import { FolderKanban } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'

import { PortalProjectsTable } from '../components/PortalProjectsTable'
import { usePortalProjects } from '../hooks/usePortalProjects'

export function PortalProjectsPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const projects = usePortalProjects({ cursor })

  if (projects.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (projects.isError) {
    return (
      <div className="space-y-4">
        <PageHeader title="Projects" description="Projects shared with your organization." />
        <ErrorAlert error={projects.error} onRetry={() => void projects.refetch()} />
      </div>
    )
  }

  const projectData = projects.data?.data ?? []
  const meta = projects.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Projects shared with your organization." />

      {projectData.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Your freelancer has not shared any projects with you yet."
        />
      ) : (
        <div className="space-y-4">
          <PortalProjectsTable projects={projectData} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
