import { useState } from 'react'

import { Plus, Users } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FreelancerStatus } from '../types'

import { CreateFreelancerDialog } from '../components/CreateFreelancerDialog'
import { FreelancersTable } from '../components/FreelancersTable'
import { useFreelancerList } from '../hooks/useFreelancerList'

export function FreelancersPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<FreelancerStatus | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const status = statusFilter === 'all' ? undefined : statusFilter
  const freelancers = useFreelancerList(cursor, status)

  const createAction = (
    <Button type="button" onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" />
      Create workspace
    </Button>
  )

  if (freelancers.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (freelancers.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Freelancers"
          description="Provision and manage freelancer workspaces."
          actions={createAction}
        />
        <ErrorAlert error={freelancers.error} onRetry={() => void freelancers.refetch()} />
      </div>
    )
  }

  const freelancerData = freelancers.data?.data ?? []
  const meta = freelancers.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freelancers"
        description="Provision and manage freelancer workspaces."
        actions={createAction}
      />

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as FreelancerStatus | 'all')
            setCursor(undefined)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {freelancerData.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No workspaces yet"
          description="Create a workspace to onboard a new freelancer."
          action={createAction}
        />
      ) : (
        <div className="space-y-4">
          <FreelancersTable freelancers={freelancerData} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}

      <CreateFreelancerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
