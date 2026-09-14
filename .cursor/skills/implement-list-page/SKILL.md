---
name: implement-list-page
description: Implements a cursor-paginated list page with DataTable, EmptyState, and loading skeleton for LanceHive. Use when building ClientsPage, ProjectsPage, InvoicesPage, or any GET list endpoint page.
---

# Implement List Page

## Page structure

```tsx
export function ClientsPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const { data, isLoading, isError, error } = useClientList(cursor)

  if (isLoading) return <LoadingSkeleton variant="page" />
  if (isError) return <ErrorAlert error={error} />

  return (
    <>
      <PageHeader title="Clients" actions={<CreateButton />} />
      {data.data.length === 0 ? (
        <EmptyState title="No clients yet" action={<CreateButton />} />
      ) : (
        <>
          <ClientsTable data={data.data} />
          <CursorPagination
            meta={data.meta}
            onNext={() => setCursor(data.meta.next_cursor ?? undefined)}
            onPrev={() => setCursor(data.meta.prev_cursor ?? undefined)}
          />
        </>
      )}
    </>
  )
}
```

## Checklist

- [ ] Cursor state in component or Zustand (filters only in Zustand)
- [ ] `per_page` default 25, max 100
- [ ] PageHeader with create action
- [ ] DataTable columns match API resource fields
- [ ] Row click navigates to detail route
- [ ] EmptyState includes create CTA
- [ ] Read-only mode disables create button

## shadcn needed

```bash
npx shadcn@latest add table badge dropdown-menu
```

## Pagination rules (from API)

- First page: no `cursor` param
- Next page: `?cursor={meta.next_cursor}`
- Disable prev/next buttons when cursor is null

## Do not

- Skip error-state integration test
- Mock TanStack Query globally — use MSW
- Skip read-only disable test on create buttons

## After implementation

Run `write-feature-tests` skill; verify task **Done when** in development-plan.
