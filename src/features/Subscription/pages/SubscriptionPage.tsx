import { useMemo } from 'react'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { ApiError } from '@/lib/errors'

import { CancelPlanDialog } from '../components/CancelPlanDialog'
import { CheckoutButton } from '../components/CheckoutButton'
import { PlanStatusCard } from '../components/PlanStatusCard'
import { useSubscription } from '../hooks/useSubscription'

function isWorkspaceOwner(role: string | undefined): boolean {
  return role === 'owner'
}

function canCheckout(status: string): boolean {
  return (
    status === 'trialing' ||
    status === 'read_only' ||
    status === 'past_due' ||
    status === 'canceled'
  )
}

function canCancel(status: string, canceledAt: string | null): boolean {
  return status === 'active' && !canceledAt
}

export function SubscriptionPage() {
  const { freelancerId, memberships } = useWorkspaceContext()

  const membership = useMemo(
    () => memberships.find((item) => String(item.freelancer_id) === freelancerId),
    [memberships, freelancerId],
  )

  const isOwner = isWorkspaceOwner(membership?.role)
  const subscription = useSubscription({ enabled: isOwner })

  if (!isOwner) {
    return (
      <div className="space-y-4">
        <PageHeader title="Subscription" description="Manage your workspace billing and plan." />
        <Alert>
          <AlertTitle>View only</AlertTitle>
          <AlertDescription>
            Only workspace owners can view and manage subscription billing.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (subscription.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (subscription.isError) {
    const forbidden = subscription.error instanceof ApiError && subscription.error.status === 403

    return (
      <div className="space-y-4">
        <PageHeader title="Subscription" description="Manage your workspace billing and plan." />
        {forbidden ? (
          <Alert>
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>
              You do not have permission to view subscription details.
            </AlertDescription>
          </Alert>
        ) : (
          <ErrorAlert error={subscription.error} onRetry={() => void subscription.refetch()} />
        )}
      </div>
    )
  }

  const data = subscription.data

  if (!data) {
    return null
  }

  const showCheckout = data.plan && !data.plan.is_custom && canCheckout(data.status)
  const showCancel = canCancel(data.status, data.canceled_at)

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription" description="Manage your workspace billing and plan." />

      <PlanStatusCard subscription={data} />

      {showCheckout ? <CheckoutButton plan={data.plan!} /> : null}

      {showCancel ? (
        <div className="flex justify-start">
          <CancelPlanDialog />
        </div>
      ) : null}
    </div>
  )
}
