import { Hexagon } from 'lucide-react'

export function AuthBrand() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-primary/10 ring-primary/15 flex size-11 items-center justify-center rounded-lg ring-1">
        <Hexagon className="text-primary size-5" aria-hidden="true" strokeWidth={2.25} />
      </div>
      <div className="space-y-1 text-center">
        <p className="font-heading text-lg font-semibold tracking-tight">LanceHive</p>
        <p className="text-muted-foreground text-xs">Freelance operations, simplified</p>
      </div>
    </div>
  )
}
