type ProjectListFilters = {
  cursor?: string
  status?: string
  client_id?: string
}

type ClientProjectListFilters = {
  cursor?: string
  status?: string
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectListFilters = {}) => [...projectKeys.lists(), filters] as const,
  clientLists: () => [...projectKeys.all, 'client-list'] as const,
  clientList: (clientId: string, filters: ClientProjectListFilters = {}) =>
    [...projectKeys.clientLists(), clientId, filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}
