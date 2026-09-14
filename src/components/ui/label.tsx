import * as React from 'react'

import { cn } from 'cn'

const labelClassName =
  'flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

function Label({ className, htmlFor, children, ...props }: React.ComponentProps<'label'>) {
  const classes = cn(labelClassName, className)

  if (htmlFor) {
    return (
      <label data-slot="label" className={classes} htmlFor={htmlFor} {...props}>
        {children}
      </label>
    )
  }

  return (
    <span data-slot="label" className={classes}>
      {children}
    </span>
  )
}

export { Label }
