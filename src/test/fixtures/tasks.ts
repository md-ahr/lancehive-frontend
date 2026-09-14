import type { TaskListResponse, TaskResource } from '@/features/Tasks/types'

const timestamps = {
  created_at: '2026-03-06T11:00:00+00:00',
  updated_at: '2026-03-08T14:30:00+00:00',
}

export const sampleTasks: TaskResource[] = [
  {
    id: 30,
    project_id: 20,
    title: 'Homepage mockup',
    status: 'in_progress',
    due_date: '2026-03-20',
    estimated_hours: '8.00',
    ...timestamps,
  },
  {
    id: 31,
    project_id: 20,
    title: 'Navigation polish',
    status: 'todo',
    due_date: null,
    estimated_hours: '4.00',
    ...timestamps,
  },
  {
    id: 32,
    project_id: 21,
    title: 'API integration',
    status: 'done',
    due_date: '2026-04-01',
    estimated_hours: '12.00',
    ...timestamps,
  },
]

export const emptyTaskListResponse: TaskListResponse = {
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

export function projectTasksResponse(projectId: number): TaskListResponse {
  return {
    data: sampleTasks.filter((task) => task.project_id === projectId),
    links: {
      first: `/api/v1/projects/${projectId}/tasks`,
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
