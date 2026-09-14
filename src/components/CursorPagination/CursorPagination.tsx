import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { PaginatedResponse } from '@/types/api'

import { Button } from '@/components/ui/button'

type CursorPaginationProps<T> = {
  meta: PaginatedResponse<T>['meta']
  onNext: () => void
  onPrev: () => void
}

export function CursorPagination<T>({ meta, onNext, onPrev }: CursorPaginationProps<T>) {
  const hasPrev = Boolean(meta.prev_cursor)
  const hasNext = Boolean(meta.next_cursor)

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-xs tabular-nums">{meta.per_page} per page</p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
