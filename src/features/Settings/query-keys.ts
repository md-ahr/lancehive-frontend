export const settingsKeys = {
  all: ['settings'] as const,
  me: () => [...settingsKeys.all, 'me'] as const,
  workspace: () => [...settingsKeys.all, 'workspace'] as const,
}
