export const adminFreelancerKeys = {
  all: ['admin-freelancers'] as const,
  lists: () => [...adminFreelancerKeys.all, 'list'] as const,
  list: (cursor?: string, status?: string) =>
    [...adminFreelancerKeys.lists(), { cursor, status }] as const,
  details: () => [...adminFreelancerKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminFreelancerKeys.details(), id] as const,
}

export const adminPlanKeys = {
  all: ['admin-plans'] as const,
  lists: () => [...adminPlanKeys.all, 'list'] as const,
  list: (isActive?: boolean) => [...adminPlanKeys.lists(), { isActive }] as const,
}
