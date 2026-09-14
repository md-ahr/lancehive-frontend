import { useState } from 'react'

import { CreditCard, Plus } from 'lucide-react'

import type { PlanResource } from '@/features/Subscription/types'

import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

import { PlanFormDialog } from '../components/PlanFormDialog'
import { PlansTable } from '../components/PlansTable'
import { usePlanList } from '../hooks/usePlanList'

export function PlansPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanResource | undefined>()
  const plans = usePlanList()

  const createAction = (
    <Button
      type="button"
      onClick={() => {
        setEditingPlan(undefined)
        setFormOpen(true)
      }}
    >
      <Plus className="size-4" />
      Create plan
    </Button>
  )

  if (plans.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (plans.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Plans"
          description="Manage platform pricing tiers and limits."
          actions={createAction}
        />
        <ErrorAlert error={plans.error} onRetry={() => void plans.refetch()} />
      </div>
    )
  }

  const planData = plans.data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        description="Manage platform pricing tiers and limits."
        actions={createAction}
      />

      {planData.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No plans yet"
          description="Create a plan to offer pricing tiers to workspaces."
          action={createAction}
        />
      ) : (
        <PlansTable
          plans={planData}
          onEdit={(plan) => {
            setEditingPlan(plan)
            setFormOpen(true)
          }}
        />
      )}

      <PlanFormDialog
        plan={editingPlan}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingPlan(undefined)
          }
        }}
      />
    </div>
  )
}
