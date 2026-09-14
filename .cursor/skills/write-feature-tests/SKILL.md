---
name: write-feature-tests
description: Writes Vitest unit and integration tests for LanceHive features using RTL and MSW. Use when implementing hooks, pages, dialogs, or completing step 8 Test in the agentic workflow.
---

# Write Feature Tests

## Before writing

1. Read `docs/standards/testing-strategy.md`
2. Read task **Done when** tests section in `docs/development-plan.md`
3. Check existing handlers in `src/test/msw/handlers/`

## File placement (colocated)

```
features/Clients/hooks/useClientList.test.ts
features/Clients/pages/ClientsPage.test.tsx
features/Clients/components/ClientFormDialog.test.tsx
```

## Hook test template

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { server } from '@/test/msw/server'
import { http, HttpResponse } from 'msw'

describe('useClientList', () => {
  it('returns paginated clients on success', async () => {
    const { result } = renderHook(() => useClientList(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
  })

  it('surfaces error on 500', async () => {
    server.use(http.get('/api/v1/clients', () => new HttpResponse(null, { status: 500 })))
    const { result } = renderHook(() => useClientList(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

## Page integration test template

```typescript
describe('ClientsPage', () => {
  it('shows loading skeleton', () => { ... })
  it('shows empty state', () => { ... })
  it('shows error with retry', () => { ... })
  it('renders table rows', () => { ... })
})
```

## Required coverage per task type

| Type | Must test |
|------|-----------|
| List page | loading, empty, error, happy, pagination |
| Detail page | loading, error, not-found, happy |
| CRUD dialog | validation, 422, success, pending disabled |
| Guard | redirect when unauthorized |
| query-keys | stable key segments |

## Run

```bash
pnpm test -- Clients
```

## Done when

- [ ] All task-specific test bullets pass
- [ ] No skipped tests without comment
- [ ] MSW handlers match API shapes from `docs/user-journey-api.md`
