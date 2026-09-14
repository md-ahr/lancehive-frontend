import type { ReactNode } from 'react'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  getRowId?: (row: T) => string | number
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No results.',
  getRowId,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton variant="table" />
  }

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground border-border rounded-none border px-4 py-8 text-center text-sm">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="border-border bg-card rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const rowKey = getRowId?.(row) ?? index
            return (
              <TableRow
                key={rowKey}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.cell(row)}</TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
