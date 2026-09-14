import type { PlanResource, SubscriptionStatus } from '@/features/Subscription/types'
import type { PaginatedResponse, User } from '@/types/api'

export type FreelancerStatus = 'pending' | 'active' | 'suspended'

export type FreelancerResource = {
  id: number
  name: string
  slug: string
  status: FreelancerStatus
  owner_user_id: number
  created_at: string
  updated_at: string
}

export type FreelancerSubscriptionSummary = {
  status: SubscriptionStatus
  plan_name: string
  trial_ends_at: string | null
}

export type FreelancerDetailResource = FreelancerResource & {
  owner: User | null
  member_count: number
  subscription_summary: FreelancerSubscriptionSummary | null
}

export type FreelancerListResponse = PaginatedResponse<FreelancerResource>

export type CreateFreelancerRequest = {
  workspace_name: string
  owner_name: string
  owner_email: string
  plan_id?: number
  trial_days?: number
}

export type UpdateFreelancerRequest = {
  status: FreelancerStatus
}

export type OverrideSubscriptionRequest = {
  plan_id: number
  provider?: 'manual' | 'stripe'
}

export type PlanListResponse = {
  data: PlanResource[]
}

export type MessageResponse = {
  message: string
}
