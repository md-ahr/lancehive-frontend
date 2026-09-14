import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useProjectTimeSummary } from '../hooks/useProjectTimeSummary'

type TimeSummaryCardProps = {
  projectId: number
}

const summaryItems = [
  { key: 'total_hours' as const, label: 'Total hours' },
  { key: 'billed_hours' as const, label: 'Billed hours' },
  { key: 'unbilled_hours' as const, label: 'Unbilled hours' },
]

export function TimeSummaryCard({ projectId }: TimeSummaryCardProps) {
  const summary = useProjectTimeSummary(String(projectId))

  if (summary.isPending) {
    return <LoadingSkeleton variant="card" />
  }

  if (summary.isError) {
    return <ErrorAlert error={summary.error} onRetry={() => void summary.refetch()} />
  }

  const data = summary.data
  if (!data) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold tabular-nums">{data[item.key]}h</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
