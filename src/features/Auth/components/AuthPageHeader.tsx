type AuthPageHeaderProps = {
  title: string
  description?: string
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="space-y-1.5">
      <h1 className="font-heading text-xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      ) : null}
    </div>
  )
}
