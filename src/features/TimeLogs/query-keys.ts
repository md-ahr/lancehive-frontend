type TaskTimeLogListFilters = {
  cursor?: string
}

export const timeLogKeys = {
  all: ['time-logs'] as const,
  taskLists: () => [...timeLogKeys.all, 'task-list'] as const,
  taskList: (taskId: string, filters: TaskTimeLogListFilters = {}) =>
    [...timeLogKeys.taskLists(), taskId, filters] as const,
  details: () => [...timeLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...timeLogKeys.details(), id] as const,
  projectSummaries: () => [...timeLogKeys.all, 'project-summary'] as const,
  projectSummary: (projectId: string) => [...timeLogKeys.projectSummaries(), projectId] as const,
}
