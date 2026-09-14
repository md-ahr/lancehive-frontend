import type {
  FreelancerDetailResource,
  FreelancerListResponse,
  FreelancerResource,
  PlanListResponse,
} from '@/features/Admin/types'
import type { SubscriptionResource } from '@/features/Subscription/types'

import { starterPlan } from './subscription'

const timestamps = {
  created_at: '2026-02-01T08:00:00+00:00',
  updated_at: '2026-02-01T08:00:00+00:00',
}

export const sampleFreelancers: FreelancerResource[] = [
  {
    id: 5,
    name: 'Acme Studio',
    slug: 'acme-studio',
    status: 'active',
    owner_user_id: 12,
    ...timestamps,
  },
  {
    id: 6,
    name: 'Beta Creative',
    slug: 'beta-creative',
    status: 'pending',
    owner_user_id: 13,
    ...timestamps,
  },
]

export const defaultFreelancerListResponse: FreelancerListResponse = {
  data: sampleFreelancers,
  links: { first: null, last: null, prev: null, next: null },
  meta: { per_page: 25, next_cursor: null, prev_cursor: null },
}

export const emptyFreelancerListResponse: FreelancerListResponse = {
  data: [],
  links: { first: null, last: null, prev: null, next: null },
  meta: { per_page: 25, next_cursor: null, prev_cursor: null },
}

export const freelancerDetail: FreelancerDetailResource = {
  ...sampleFreelancers[0],
  owner: {
    id: 12,
    name: 'Alice Owner',
    email: 'alice@acme.test',
    role: 'freelancer',
    email_verified_at: null,
    ...timestamps,
  },
  member_count: 3,
  subscription_summary: {
    status: 'trialing',
    plan_name: 'Starter',
    trial_ends_at: '2026-03-01T08:00:00+00:00',
  },
}

export const proPlan = {
  ...starterPlan,
  id: 2,
  name: 'Pro',
  slug: 'pro',
  price_monthly: '500.00',
  price_yearly: '5000.00',
  max_clients: 10,
  max_projects: 20,
  max_team_members: 5,
  sort_order: 2,
}

export const defaultPlanListResponse: PlanListResponse = {
  data: [starterPlan, proPlan],
}

export const overrideSubscriptionResponse: SubscriptionResource = {
  id: 7,
  freelancer_id: 5,
  plan_id: 2,
  status: 'active',
  billing_interval: 'monthly',
  trial_ends_at: null,
  current_period_start: '2026-02-01T08:00:00+00:00',
  current_period_end: '2026-03-01T08:00:00+00:00',
  read_only_at: null,
  canceled_at: null,
  provider: 'manual',
  plan: proPlan,
  ...timestamps,
}
