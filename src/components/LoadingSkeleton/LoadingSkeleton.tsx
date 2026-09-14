import { Skeleton } from '@/components/ui/skeleton'

type LoadingSkeletonProps = {
  variant: 'page' | 'table' | 'card'
}

export function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  if (variant === 'table') {
    return (
      <div className="space-y-3" data-testid="loading-skeleton-table">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        className="border-border space-y-3 rounded-none border p-4"
        data-testid="loading-skeleton-card"
      >
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="loading-skeleton-page">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
