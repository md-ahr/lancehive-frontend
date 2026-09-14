type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coming soon.</p>
    </div>
  )
}
