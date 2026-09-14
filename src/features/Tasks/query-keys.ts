type ProjectTaskListFilters = {
  cursor?: string
  status?: string
}

export const taskKeys = {
  all: ['tasks'] as const,
  projectLists: () => [...taskKeys.all, 'project-list'] as const,
  projectList: (projectId: string, filters: ProjectTaskListFilters = {}) =>
    [...taskKeys.projectLists(), projectId, filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}
