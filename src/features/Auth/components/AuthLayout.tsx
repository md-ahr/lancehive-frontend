import { Outlet } from 'react-router-dom'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { AuthBrand } from './AuthBrand'

export function AuthLayout() {
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

      <div className="relative w-full max-w-105">
        <Card className="border-border/80 rounded-lg shadow-sm">
          <CardHeader className="border-border/60 border-b pb-6">
            <AuthBrand />
          </CardHeader>
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} LanceHive
        </p>
      </div>
    </div>
  )
}
