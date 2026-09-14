import type { ReactNode } from 'react'

import { Link } from 'react-router-dom'

type AuthFooterLinkProps = {
  to: string
  children: ReactNode
}

export function AuthFooterLink({ to, children }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-sm">
      <Link
        to={to}
        className="text-muted-foreground hover:text-primary transition-colors hover:underline"
      >
        {children}
      </Link>
    </p>
  )
}
