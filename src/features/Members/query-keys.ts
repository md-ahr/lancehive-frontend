export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (cursor?: string) => [...memberKeys.lists(), { cursor }] as const,
}
