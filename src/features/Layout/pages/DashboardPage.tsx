import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMe } from '@/features/Auth/hooks/useMe'

const placeholderCards = [
  { title: 'Active clients', value: '—' },
  { title: 'Open projects', value: '—' },
  { title: 'Outstanding invoices', value: '—' },
]

export function DashboardPage() {
  const me = useMe()

  if (me.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  const workspaceName = me.data?.active_freelancer?.name ?? 'your workspace'

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description={`Overview for ${workspaceName}`} />
      <div className="grid gap-4 md:grid-cols-3">
        {placeholderCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-2xl font-semibold tabular-nums">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
