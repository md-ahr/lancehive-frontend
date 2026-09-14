import type { FreelancerMembership, PaginatedResponse } from '@/types/api'

export type MemberResource = FreelancerMembership

export type MemberListResponse = PaginatedResponse<MemberResource>

export type InviteMemberRole = 'admin' | 'member'

export type InviteMemberRequest = {
  name: string
  email: string
  role: InviteMemberRole
}
