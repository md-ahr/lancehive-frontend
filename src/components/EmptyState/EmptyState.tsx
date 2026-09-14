import type { ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border-border bg-muted/30 flex flex-col items-center justify-center gap-3 rounded-none border border-dashed px-6 py-12 text-center">
      {Icon ? <Icon className="text-muted-foreground size-8" aria-hidden /> : null}
      <div className="space-y-1">
        <h2 className="font-heading text-sm font-medium">{title}</h2>
        {description ? (
          <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
