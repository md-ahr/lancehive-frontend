import { useIsReadOnly } from './useIsReadOnly'

export function useCanWrite(): boolean {
  const isReadOnly = useIsReadOnly()
  return !isReadOnly
}
