import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { SubscriptionDetailResource } from '../types'

import {
  formatPlanPrice,
  formatSubscriptionDate,
  formatSubscriptionStatus,
  formatUsageLimit,
  subscriptionStatusBadgeVariant,
} from '../lib/format-subscription'

type PlanStatusCardProps = {
  subscription: SubscriptionDetailResource
}

export function PlanStatusCard({ subscription }: PlanStatusCardProps) {
  const plan = subscription.plan
  const currency = plan?.currency ?? 'BDT'

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="font-heading text-xl">{plan?.name ?? 'Current plan'}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {subscription.billing_interval
              ? `${formatPlanPrice(
                  subscription.billing_interval === 'monthly'
                    ? (plan?.price_monthly ?? null)
                    : (plan?.price_yearly ?? null),
                  currency,
                )} / ${subscription.billing_interval}`
              : 'Trial — choose billing when you subscribe'}
          </p>
        </div>
        <Badge variant={subscriptionStatusBadgeVariant(subscription.status)}>
          {formatSubscriptionStatus(subscription.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {subscription.trial_ends_at ? (
            <div>
              <dt className="text-muted-foreground text-sm">Trial ends</dt>
              <dd className="font-medium tabular-nums">
                {formatSubscriptionDate(subscription.trial_ends_at)}
              </dd>
            </div>
          ) : null}
          {subscription.current_period_end ? (
            <div>
              <dt className="text-muted-foreground text-sm">Current period ends</dt>
              <dd className="font-medium tabular-nums">
                {formatSubscriptionDate(subscription.current_period_end)}
              </dd>
            </div>
          ) : null}
          {subscription.days_remaining !== null ? (
            <div>
              <dt className="text-muted-foreground text-sm">Days remaining</dt>
              <dd className="font-medium tabular-nums">{subscription.days_remaining}</dd>
            </div>
          ) : null}
          {subscription.canceled_at ? (
            <div>
              <dt className="text-muted-foreground text-sm">Canceled on</dt>
              <dd className="font-medium tabular-nums">
                {formatSubscriptionDate(subscription.canceled_at)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div>
          <h3 className="mb-3 text-sm font-medium">Usage</h3>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground text-sm">Clients</dt>
              <dd className="font-medium tabular-nums">
                {formatUsageLimit(subscription.usage.clients, subscription.usage.max_clients)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Projects</dt>
              <dd className="font-medium tabular-nums">
                {formatUsageLimit(subscription.usage.projects, subscription.usage.max_projects)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Team members</dt>
              <dd className="font-medium tabular-nums">
                {formatUsageLimit(
                  subscription.usage.team_members,
                  subscription.usage.max_team_members,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}
