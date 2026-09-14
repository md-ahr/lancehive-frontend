import type {
  ProjectTimeSummaryResource,
  TimeLogListResponse,
  TimeLogResource,
} from '@/features/TimeLogs/types'

const timestamps = {
  created_at: '2026-03-08T14:00:00+00:00',
  updated_at: '2026-03-08T14:00:00+00:00',
}

export const sampleTimeLogs: TimeLogResource[] = [
  {
    id: 40,
    task_id: 30,
    user_id: 12,
    hours: '2.50',
    description: 'Initial wireframes',
    logged_at: '2026-03-08T09:00:00+00:00',
    client_invoice_item_id: null,
    ...timestamps,
  },
  {
    id: 41,
    task_id: 30,
    user_id: 12,
    hours: '1.00',
    description: 'Review meeting',
    logged_at: '2026-03-09T14:00:00+00:00',
    client_invoice_item_id: 5,
    ...timestamps,
  },
  {
    id: 42,
    task_id: 31,
    user_id: 12,
    hours: '3.00',
    description: 'Navigation updates',
    logged_at: '2026-03-10T10:00:00+00:00',
    client_invoice_item_id: null,
    ...timestamps,
  },
]

export const emptyTimeLogListResponse: TimeLogListResponse = {
  data: [],
  links: {
    first: null,
    last: null,
    prev: null,
    next: null,
  },
  meta: {
    per_page: 25,
    next_cursor: null,
    prev_cursor: null,
  },
}

export function taskTimeLogsResponse(taskId: number): TimeLogListResponse {
  return {
    data: sampleTimeLogs.filter((log) => log.task_id === taskId),
    links: {
      first: `/api/v1/tasks/${taskId}/time-logs`,
      last: null,
      prev: null,
      next: null,
    },
    meta: {
      per_page: 25,
      next_cursor: null,
      prev_cursor: null,
    },
  }
}

export function projectTimeSummaryResponse(projectId: number): ProjectTimeSummaryResource {
  return {
    project_id: projectId,
    total_hours: '6.50',
    billed_hours: '1.00',
    unbilled_hours: '5.50',
  }
}
