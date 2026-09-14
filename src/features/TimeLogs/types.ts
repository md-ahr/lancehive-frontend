import type { PaginatedResponse } from '@/types/api'

export type TimeLogResource = {
  id: number
  task_id: number
  user_id: number
  hours: string
  description: string | null
  logged_at: string
  client_invoice_item_id: number | null
  created_at: string
  updated_at: string
}

export type TimeLogListResponse = PaginatedResponse<TimeLogResource>

export type CreateTimeLogRequest = {
  hours: string
  description?: string
  logged_at: string
}

export type UpdateTimeLogRequest = {
  hours?: string
  description?: string | null
  logged_at?: string
}

export type ProjectTimeSummaryResource = {
  project_id: number
  total_hours: string
  billed_hours: string
  unbilled_hours: string
}
