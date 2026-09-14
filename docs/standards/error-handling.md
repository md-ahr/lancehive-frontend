# Error Handling

Centralized, user-friendly errors. Never expose stack traces or raw API bodies in UI.

---

## API layer (`lib/api.ts`, `lib/errors.ts`)

### ApiError

All failed responses throw `ApiError` with `status` and parsed `body`.

```typescript
// lib/errors.ts — helpers
export function getErrorCode(error: unknown): string | undefined
export function isValidationError(error: unknown): error is ApiError
export function mapValidationErrorsToForm(error: ApiError, setError: UseFormSetError)
export function getUserMessage(error: unknown): string
```

### Global query/mutation defaults

In QueryClient config:

| Status | Behavior |
|--------|----------|
| 401 | Clear token → redirect `/login` |
| 403 `workspace_read_only` | Show ReadOnlyBanner; toast on write attempt |
| 403 `forbidden` | Toast "You don't have permission" |
| 404 | Page-level not found or toast |
| 422 validation | Form field mapping (not toast) |
| 422 `plan_limit_exceeded` | Toast + link to subscription |
| 429 | Toast "Too many requests" + retry hint |
| 5xx | Toast generic message; log in dev only |

## UI layers

| Layer | Use | Component |
|-------|-----|-----------|
| Page load failure | Full page | `ErrorAlert` + retry button |
| List empty | Not an error | `EmptyState` |
| Mutation failure | Transient action | `toast.error(getUserMessage(e))` |
| Form validation | Field-level | `FormMessage` from RHF |
| Route crash | Uncaught render | Route `ErrorBoundary` |

## Forms (422)

```typescript
catch (error) {
  if (isValidationError(error)) {
    mapValidationErrorsToForm(error, form.setError)
    return
  }
  toast.error(getUserMessage(error))
}
```

Laravel shape: `body.errors[field][]` — map first message per field.

## TanStack Query

```typescript
// Page
const { isError, error, refetch } = useClientList()
if (isError) return <ErrorAlert error={error} onRetry={() => refetch()} />

// Mutation — handle in onError or try/catch in submit handler
```

Do not swallow errors in empty `catch {}`.

## Error boundaries

- One boundary per route segment (`/app`, `/portal`, `/admin`)
- Fallback: friendly message + "Reload" button
- Log `error.message` in dev only — never to external services with PII

## User-facing messages

| ❌ Don't show | ✅ Show |
|--------------|---------|
| `ApiError: status 422` | "Please fix the highlighted fields." |
| Stack trace | "Something went wrong. Try again." |
| `{ "code": "forbidden" }` | "You don't have permission to do that." |

## Testing errors

Every page integration test must include at least one error state:

```typescript
server.use(http.get('/api/v1/clients', () => HttpResponse.json({ code: '...' }, { status: 500 })))
// expect ErrorAlert or toast
```

Reference: `docs/user-journey-api.md` error cheat sheet.
