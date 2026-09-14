import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground text-sm">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button type="button">Go home</Button>
      </Link>
    </div>
  )
}
