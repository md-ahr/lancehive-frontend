import type { PlanResource } from '@/features/Subscription/types'

import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function formatPrice(value: string | null, currency: string) {
  if (!value) {
    return 'Custom'
  }

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatLimit(value: number | null) {
  return value === null ? 'Unlimited' : String(value)
}

function PlanFlagsCell({ plan }: { plan: PlanResource }) {
  return (
    <div className="flex flex-wrap gap-1">
      {plan.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
      {plan.is_custom ? <Badge variant="outline">Custom</Badge> : null}
    </div>
  )
}

function PlanActionsCell({
  plan,
  onEdit,
}: {
  plan: PlanResource
  onEdit: (plan: PlanResource) => void
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => onEdit(plan)}>
      Edit
    </Button>
  )
}

function getPlanColumns(
  onEdit: (plan: PlanResource) => void,
): Array<DataTableColumn<PlanResource>> {
  return [
    {
      id: 'name',
      header: 'Name',
      cell: (plan) => plan.name,
    },
    {
      id: 'slug',
      header: 'Slug',
      cell: (plan) => plan.slug,
    },
    {
      id: 'price_monthly',
      header: 'Monthly',
      cell: (plan) => (
        <span className="tabular-nums">{formatPrice(plan.price_monthly, plan.currency)}</span>
      ),
    },
    {
      id: 'price_yearly',
      header: 'Yearly',
      cell: (plan) => (
        <span className="tabular-nums">{formatPrice(plan.price_yearly, plan.currency)}</span>
      ),
    },
    {
      id: 'limits',
      header: 'Limits',
      cell: (plan) =>
        `${formatLimit(plan.max_clients)} clients · ${formatLimit(plan.max_projects)} projects · ${formatLimit(plan.max_team_members)} members`,
    },
    {
      id: 'flags',
      header: 'Flags',
      cell: (plan) => <PlanFlagsCell plan={plan} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (plan) => <PlanActionsCell plan={plan} onEdit={onEdit} />,
    },
  ]
}

type PlansTableProps = {
  plans: PlanResource[]
  isLoading?: boolean
  onEdit: (plan: PlanResource) => void
}

export function PlansTable({ plans, isLoading, onEdit }: PlansTableProps) {
  const columns = getPlanColumns(onEdit)

  return (
    <DataTable columns={columns} data={plans} isLoading={isLoading} getRowId={(plan) => plan.id} />
  )
}
