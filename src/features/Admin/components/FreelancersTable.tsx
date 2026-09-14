import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserMessage } from '@/lib/errors'

import type { FreelancerResource, FreelancerStatus } from '../types'

import { useUpdateFreelancer } from '../hooks/useUpdateFreelancer'
import { ResendInviteButton } from './ResendInviteButton'
import { SubscriptionOverrideDialog } from './SubscriptionOverrideDialog'

function statusBadgeVariant(status: FreelancerStatus) {
  if (status === 'active') {
    return 'default' as const
  }

  if (status === 'pending') {
    return 'secondary' as const
  }

  return 'outline' as const
}

function formatStatus(status: FreelancerStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

type FreelancerStatusCellProps = {
  freelancer: FreelancerResource
  disabled: boolean
  onStatusChange: (freelancer: FreelancerResource, status: FreelancerStatus) => void
}

function FreelancerStatusCell({ freelancer, disabled, onStatusChange }: FreelancerStatusCellProps) {
  return (
    <Select
      value={freelancer.status}
      onValueChange={(value) => onStatusChange(freelancer, value as FreelancerStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-32">
        <SelectValue>
          <Badge variant={statusBadgeVariant(freelancer.status)}>
            {formatStatus(freelancer.status)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="suspended">Suspended</SelectItem>
      </SelectContent>
    </Select>
  )
}

type FreelancerActionsCellProps = {
  freelancer: FreelancerResource
  onOverride: (freelancer: FreelancerResource) => void
}

function FreelancerActionsCell({ freelancer, onOverride }: FreelancerActionsCellProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {freelancer.status === 'pending' ? (
        <ResendInviteButton freelancerId={String(freelancer.id)} />
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={() => onOverride(freelancer)}>
        Override plan
      </Button>
    </div>
  )
}

function getFreelancerColumns({
  statusUpdatePending,
  onStatusChange,
  onOverride,
}: {
  statusUpdatePending: boolean
  onStatusChange: (freelancer: FreelancerResource, status: FreelancerStatus) => void
  onOverride: (freelancer: FreelancerResource) => void
}): Array<DataTableColumn<FreelancerResource>> {
  return [
    {
      id: 'name',
      header: 'Workspace',
      cell: (freelancer) => freelancer.name,
    },
    {
      id: 'slug',
      header: 'Slug',
      cell: (freelancer) => freelancer.slug,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (freelancer) => (
        <FreelancerStatusCell
          freelancer={freelancer}
          disabled={statusUpdatePending}
          onStatusChange={onStatusChange}
        />
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (freelancer) => formatCreatedAt(freelancer.created_at),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (freelancer) => (
        <FreelancerActionsCell freelancer={freelancer} onOverride={onOverride} />
      ),
    },
  ]
}

type FreelancersTableProps = {
  freelancers: FreelancerResource[]
  isLoading?: boolean
}

export function FreelancersTable({ freelancers, isLoading }: FreelancersTableProps) {
  const updateFreelancer = useUpdateFreelancer()
  const [overrideTarget, setOverrideTarget] = useState<FreelancerResource | null>(null)

  const handleStatusChange = useCallback(
    async (freelancer: FreelancerResource, status: FreelancerStatus) => {
      if (status === freelancer.status) {
        return
      }

      try {
        await updateFreelancer.mutateAsync({ id: String(freelancer.id), status })
        toast.success('Workspace status updated')
      } catch (error) {
        toast.error(getUserMessage(error))
      }
    },
    [updateFreelancer],
  )

  const columns = getFreelancerColumns({
    statusUpdatePending: updateFreelancer.isPending,
    onStatusChange: (freelancer, status) => void handleStatusChange(freelancer, status),
    onOverride: setOverrideTarget,
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={freelancers}
        isLoading={isLoading}
        getRowId={(freelancer) => freelancer.id}
      />

      {overrideTarget ? (
        <SubscriptionOverrideDialog
          freelancer={overrideTarget}
          open={Boolean(overrideTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setOverrideTarget(null)
            }
          }}
        />
      ) : null}
    </>
  )
}
