import type { SubscriptionStatus } from '../types'

export function formatSubscriptionStatus(status: SubscriptionStatus) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function subscriptionStatusBadgeVariant(status: SubscriptionStatus) {
  if (status === 'active') {
    return 'default' as const
  }

  if (status === 'trialing') {
    return 'secondary' as const
  }

  if (status === 'past_due' || status === 'read_only') {
    return 'destructive' as const
  }

  return 'outline' as const
}

export function formatPlanPrice(amount: string | null, currency: string) {
  if (!amount) {
    return '—'
  }

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount))
}

export function formatSubscriptionDate(value: string | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatUsageLimit(current: number, max: number | null) {
  if (max === null) {
    return `${current} / Unlimited`
  }

  return `${current} / ${max}`
}
