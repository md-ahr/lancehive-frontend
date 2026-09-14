import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'

import type { ProjectResource, ProjectStatus } from '../types'

function statusBadgeVariant(status: ProjectStatus) {
  if (status === 'active') {
    return 'default' as const
  }

  if (status === 'completed') {
    return 'secondary' as const
  }

  return 'outline' as const
}

function formatStatus(status: ProjectStatus) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatHourlyRate(rate: string, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(rate))
}

type ProjectHeaderProps = {
  project: ProjectResource
  clientName?: string
  actions?: ReactNode
}

export function ProjectHeader({ project, clientName, actions }: ProjectHeaderProps) {
  return (
    <div className="border-border flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{project.name}</h1>
          <Badge variant={statusBadgeVariant(project.status)}>{formatStatus(project.status)}</Badge>
        </div>
        <div className="text-muted-foreground space-y-1 text-sm">
          {clientName ? <p>Client: {clientName}</p> : null}
          <p className="tabular-nums">
            Hourly rate: {formatHourlyRate(project.hourly_rate, project.currency)}
          </p>
          <p>Deadline: {project.deadline ?? 'No deadline set'}</p>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
