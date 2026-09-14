---
name: api-feature-integration
description: Integrates LanceHive REST API endpoints with TanStack Query hooks and TypeScript types. Use when creating hooks, types, query-keys, or connecting features to /api/v1 endpoints.
---

# API Feature Integration

## Read first

- `docs/user-journey-api.md` — endpoint, headers, response shape
- `.cursor/rules/api-integration.mdc` — pagination, errors

## Hook naming

| Operation | Hook name | Method |
|-----------|-----------|--------|
| List | `use{Entity}List` | GET + cursor |
| Detail | `use{Entity}` | GET by id |
| Create | `useCreate{Entity}` | POST |
| Update | `useUpdate{Entity}` | PATCH |
| Delete | `useDelete{Entity}` | DELETE |

## query-keys.ts pattern

```typescript
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (cursor?: string) => [...clientKeys.lists(), { cursor }] as const,
  detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
}
```

## Hook pattern

```typescript
export function useClientList(cursor?: string) {
  const { freelancerId } = useWorkspaceContext()
  return useQuery({
    queryKey: clientKeys.list(cursor),
    queryFn: () => apiRequest<PaginatedResponse<Client>>(
      `/clients?${new URLSearchParams({ ...(cursor && { cursor }) })}`,
      { freelancerId },
    ),
  })
}
```

## Mutation invalidation

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
}
```

## Mutation invalidation

Never `queryClient.clear()`.

## Errors

Use `getUserMessage`, `mapValidationErrorsToForm` from `@/lib/errors`. See `error-handling.mdc`.

## Tests required

After hooks, add `*.test.ts` with MSW. Skill: `write-feature-tests`.

## Context headers

| Feature area | Pass to apiRequest |
|--------------|-------------------|
| Tenant | `{ freelancerId }` |
| Portal | `{ clientId }` |
| Admin | `{}` |

## Error in hooks

Let `ApiError` bubble to UI. Map 422 validation errors to form fields in the dialog component.

## Types

Define in `features/{Name}/types.ts`. Shared types in `src/types/api.ts`:

- `PaginatedResponse<T>`
- `MeResponse`
- `ApiErrorBody`
