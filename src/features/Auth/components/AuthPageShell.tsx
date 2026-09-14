import type { ReactNode } from 'react'

type AuthPageShellProps = {
  children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
  return <div className="space-y-6">{children}</div>
}
