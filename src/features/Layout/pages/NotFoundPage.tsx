import { ArrowLeft, FileQuestion, Hexagon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="bg-muted/40 relative flex min-h-svh flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.457_0.24_277.023/0.07),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)] bg-size-[4rem_4rem]"
      />

      <div className="relative w-full max-w-md">
        <Card className="border-border/80 overflow-hidden rounded-lg shadow-sm">
          <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/10 ring-primary/15 flex size-10 items-center justify-center rounded-lg ring-1">
                <Hexagon className="text-primary size-4.5" aria-hidden="true" strokeWidth={2.25} />
              </div>
              <p className="font-heading text-sm font-semibold tracking-tight">LanceHive</p>
            </div>

            <div className="relative flex flex-col items-center gap-4">
              <p
                aria-hidden="true"
                className="font-heading text-muted-foreground/15 text-8xl font-bold tracking-tighter select-none"
              >
                404
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background ring-border/60 flex size-14 items-center justify-center rounded-lg shadow-sm ring-1">
                  <FileQuestion
                    className="text-primary size-7"
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-xl font-semibold tracking-tight">Page not found</h1>
              <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
                The page you are looking for does not exist or may have been moved.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Link to="/" className="sm:w-auto">
                <Button type="button" size="lg" className="w-full gap-2">
                  <ArrowLeft aria-hidden="true" />
                  Go home
                </Button>
              </Link>
              <Link to="/login" className="sm:w-auto">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Sign in
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} LanceHive
        </p>
      </div>
    </div>
  )
}
