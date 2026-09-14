import type {
  CheckoutResponse,
  SubscriptionDetailResource,
  SubscriptionResource,
} from '@/features/Subscription/types'

const timestamps = {
  created_at: '2026-02-01T08:00:00+00:00',
  updated_at: '2026-02-01T08:00:00+00:00',
}

export const starterPlan = {
  id: 1,
  name: 'Starter',
  slug: 'starter',
  price_monthly: '200.00',
  price_yearly: '2000.00',
  currency: 'BDT',
  max_clients: 3,
  max_projects: 5,
  max_team_members: 1,
  is_custom: false,
  is_active: true,
  sort_order: 1,
  created_at: '2026-01-01T00:00:00+00:00',
  updated_at: '2026-01-01T00:00:00+00:00',
}

export const trialingSubscription: SubscriptionDetailResource = {
  id: 7,
  freelancer_id: 42,
  plan_id: 1,
  status: 'trialing',
  billing_interval: null,
  trial_ends_at: '2026-03-24T00:00:00+00:00',
  current_period_start: null,
  current_period_end: null,
  read_only_at: null,
  canceled_at: null,
  provider: 'stripe',
  plan: starterPlan,
  days_remaining: 14,
  usage: {
    clients: 1,
    projects: 2,
    team_members: 1,
    max_clients: 3,
    max_projects: 5,
    max_team_members: 1,
  },
  ...timestamps,
}

export const activeSubscription: SubscriptionDetailResource = {
  ...trialingSubscription,
  status: 'active',
  billing_interval: 'monthly',
  trial_ends_at: null,
  current_period_start: '2026-02-01T08:00:00+00:00',
  current_period_end: '2026-03-01T08:00:00+00:00',
  days_remaining: 18,
}

export const readOnlySubscription: SubscriptionDetailResource = {
  ...trialingSubscription,
  status: 'read_only',
  billing_interval: 'monthly',
  trial_ends_at: null,
  read_only_at: '2026-02-15T08:00:00+00:00',
  days_remaining: null,
}

export const canceledSubscriptionResource: SubscriptionResource = {
  id: activeSubscription.id,
  freelancer_id: activeSubscription.freelancer_id,
  plan_id: activeSubscription.plan_id,
  status: 'canceled',
  billing_interval: activeSubscription.billing_interval,
  trial_ends_at: activeSubscription.trial_ends_at,
  current_period_start: activeSubscription.current_period_start,
  current_period_end: activeSubscription.current_period_end,
  read_only_at: activeSubscription.read_only_at,
  canceled_at: '2026-02-20T08:00:00+00:00',
  provider: activeSubscription.provider,
  plan: activeSubscription.plan,
  created_at: activeSubscription.created_at,
  updated_at: activeSubscription.updated_at,
}

export const checkoutResponse: CheckoutResponse = {
  checkout_url: 'https://checkout.stripe.com/test-session',
}
