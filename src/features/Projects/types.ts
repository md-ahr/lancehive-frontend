import type { PaginatedResponse } from '@/types/api'

export type ProjectStatus = 'active' | 'on_hold' | 'completed'

export type ProjectResource = {
  id: number
  client_id: number
  name: string
  hourly_rate: string
  currency: string
  status: ProjectStatus
  deadline: string | null
  created_at: string
  updated_at: string
}

export type ProjectListResponse = PaginatedResponse<ProjectResource>

export type CreateProjectRequest = {
  name: string
  hourly_rate: string
  currency?: string
  deadline?: string
  status?: ProjectStatus
}

export type UpdateProjectRequest = {
  name?: string
  hourly_rate?: string
  currency?: string
  deadline?: string | null
  status?: ProjectStatus
}
