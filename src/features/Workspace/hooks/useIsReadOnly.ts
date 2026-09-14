import { useMe } from '@/features/Auth/hooks/useMe'

export function useIsReadOnly(): boolean {
  const me = useMe()
  return me.data?.subscription?.read_only ?? false
}
