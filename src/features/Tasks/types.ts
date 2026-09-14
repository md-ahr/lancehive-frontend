import type { PaginatedResponse } from '@/types/api'

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskResource = {
  id: number
  project_id: number
  title: string
  status: TaskStatus
  due_date: string | null
  estimated_hours: string | null
  created_at: string
  updated_at: string
}

export type TaskListResponse = PaginatedResponse<TaskResource>

export type CreateTaskRequest = {
  title: string
  status?: TaskStatus
  due_date?: string
  estimated_hours?: string
}

export type UpdateTaskRequest = {
  title?: string
  status?: TaskStatus
  due_date?: string | null
  estimated_hours?: string | null
}
