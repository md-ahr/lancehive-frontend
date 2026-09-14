export type UserRole = 'super_admin' | 'freelancer' | 'client'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export type FreelancerMembershipRole = 'owner' | 'admin' | 'member'

export type Freelancer = {
  id: number
  name: string
  slug: string
  status: string
  owner_user_id: number
  created_at: string
  updated_at: string
}

export type FreelancerMembership = {
  id: number
  freelancer_id: number
  user_id: number
  role: FreelancerMembershipRole
  user?: User | null
  freelancer?: Freelancer | null
  created_at: string
  updated_at: string
}

export type ClientMembershipRole = 'primary' | 'member' | 'viewer'

export type Client = {
  id: number
  name: string
  slug: string
  status: string
  created_at: string
  updated_at: string
}

export type ClientMembership = {
  id: number
  client_id: number
  user_id: number
  role: ClientMembershipRole
  user?: User | null
  client?: Client | null
  created_at: string
  updated_at: string
}

export type SubscriptionSummary = {
  status: 'trialing' | 'active' | 'past_due' | 'read_only' | 'canceled'
  plan_name: string
  read_only: boolean
  trial_ends_at: string | null
}

export type UserSettings = {
  timezone: string
  locale: string
}

export type MeResponse = {
  user: User
  user_settings: UserSettings
  memberships: FreelancerMembership[]
  active_freelancer: Freelancer | null
  subscription: SubscriptionSummary | null
  client_memberships: ClientMembership[]
  active_client: Client | null
}

export type PaginatedResponse<T> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    path?: string
    per_page: number
    next_cursor: string | null
    prev_cursor: string | null
  }
}

export type ApiErrorBody = {
  message?: string
  code?: string
  errors?: Record<string, string[]>
}

export type ApiErrorCode =
  | 'unauthenticated'
  | 'forbidden'
  | 'workspace_read_only'
  | 'super_admin_required'
  | 'not_found'
  | 'export_expired'
  | 'validation_failed'
  | 'plan_limit_exceeded'
  | 'invoice_not_editable'
  | 'too_many_requests'
