export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (cursor?: string) => [...clientKeys.lists(), { cursor }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
}

export const clientMemberKeys = {
  all: ['client-members'] as const,
  lists: () => [...clientMemberKeys.all, 'list'] as const,
  list: (clientId: string, cursor?: string) =>
    [...clientMemberKeys.lists(), clientId, { cursor }] as const,
}
