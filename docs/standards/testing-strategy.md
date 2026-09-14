# Testing Strategy

**Stack:** Vitest · React Testing Library · MSW · jsdom

Tests are **required** for every development-plan task unless marked "Tests: N/A".

---

## Setup (task F-13)

| File | Purpose |
|------|---------|
| `vitest.config.ts` | jsdom, `@/` alias, setupFiles |
| `src/test/setup.ts` | RTL cleanup, MSW lifecycle |
| `src/test/test-utils.tsx` | `renderWithProviders()` — QueryClient, Router |
| `src/test/msw/server.ts` | MSW server instance |
| `src/test/msw/handlers/` | Per-domain handlers |

```bash
pnpm test              # run all
pnpm test:watch        # watch mode
pnpm test -- ClientsPage  # filter by name
pnpm test:coverage     # coverage report
```

---

## Test pyramid

| Layer | Tool | What to test |
|-------|------|--------------|
| **Unit** | Vitest | query-keys, zod schemas, `lib/errors` helpers, pure utils |
| **Hook** | Vitest + RTL + MSW | TanStack Query hooks — loading, success, error |
| **Component** | Vitest + RTL | Shared components, dialogs — four UI states |
| **Integration** | Vitest + RTL + MSW | Pages — user flows, guards, pagination |

E2E (Playwright) — later phase, not required per task initially.

---

## Required tests by task type

### Hook task

```typescript
// useClientList.test.ts
describe('useClientList', () => {
  it('fetches clients with X-Freelancer-Id header', async () => { ... })
  it('returns paginated data on success', async () => { ... })
  it('surfaces ApiError on 500', async () => { ... })
})
```

### Page task

```typescript
// ClientsPage.test.tsx
describe('ClientsPage', () => {
  it('shows loading skeleton while fetching', () => { ... })
  it('shows empty state when no clients', () => { ... })
  it('shows error alert on API failure with retry', () => { ... })
  it('renders client rows on success', () => { ... })
  it('navigates to next cursor page', () => { ... })
})
```

### Form dialog task

```typescript
describe('ClientFormDialog', () => {
  it('validates required fields before submit', () => { ... })
  it('maps 422 errors to form fields', () => { ... })
  it('calls create mutation and closes on success', () => { ... })
  it('disables submit while pending', () => { ... })
})
```

### Guard task

```typescript
it('redirects unauthenticated user to /login', () => { ... })
it('blocks non-admin from workspace settings', () => { ... })
```

---

## MSW handlers

Mirror real API shapes from `docs/user-journey-api.md`:

```typescript
// src/test/msw/handlers/clients.handlers.ts
export const clientsHandlers = [
  http.get('/api/v1/clients', () => HttpResponse.json(mockPaginatedClients)),
  http.post('/api/v1/clients', async ({ request }) => { ... }),
]
```

Override per test with `server.use(...)`.

---

## renderWithProviders

```typescript
export function renderWithProviders(ui: ReactElement, options?: {
  route?: string
  queryClient?: QueryClient
}) {
  // Wrap: MemoryRouter, QueryClientProvider, WorkspaceProvider (if needed)
}
```

---

## Coverage targets (incremental)

| Area | Target |
|------|--------|
| `lib/` helpers | 90%+ |
| Feature hooks | 80%+ |
| Pages (integration) | key flows covered |
| shadcn `ui/` | skip (vendor) |

---

## Agent workflow (step 8 — Test)

After Compose + Styles, before Verify:

1. Identify test files to create (colocated)
2. Write unit tests for hooks/schemas/keys
3. Write integration tests for pages/components
4. Run `pnpm test -- {feature}` until green
5. Check task acceptance criteria test bullets

Use skill: `.cursor/skills/write-feature-tests/`

---

## Do not

- Test implementation details (internal state)
- Snapshot entire pages ( brittle ) — snapshot query keys / small outputs only
- Mock TanStack Query globally — mock HTTP with MSW instead
- Skip error-state tests
