export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'read_only' | 'canceled'

export type BillingInterval = 'monthly' | 'yearly'

export type PlanResource = {
  id: number
  name: string
  slug: string
  price_monthly: string | null
  price_yearly: string | null
  currency: string
  max_clients: number | null
  max_projects: number | null
  max_team_members: number | null
  is_custom: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type SubscriptionUsage = {
  clients: number
  projects: number
  team_members: number
  max_clients: number | null
  max_projects: number | null
  max_team_members: number | null
}

export type SubscriptionDetailResource = {
  id: number
  freelancer_id: number
  plan_id: number
  status: SubscriptionStatus
  billing_interval: BillingInterval | null
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  read_only_at: string | null
  canceled_at: string | null
  provider: 'stripe' | 'manual'
  plan: PlanResource | null
  days_remaining: number | null
  usage: SubscriptionUsage
  created_at: string
  updated_at: string
}

export type SubscriptionResource = Omit<SubscriptionDetailResource, 'days_remaining' | 'usage'>

export type CheckoutResponse = {
  checkout_url: string
}

export type CheckoutRequest = {
  plan_id: number
  billing_interval: BillingInterval
}

export type SwapSubscriptionRequest = CheckoutRequest
