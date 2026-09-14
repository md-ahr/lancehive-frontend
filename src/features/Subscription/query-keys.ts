export const subscriptionKeys = {
  all: ['subscription'] as const,
  detail: () => [...subscriptionKeys.all, 'detail'] as const,
}
