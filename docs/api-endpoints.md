# API Endpoints — Frontend Agent Guide

> How frontend agents should use the LanceHive API contract when building hooks, types, forms, and MSW handlers.

## Source of truth

| Layer | Location | Use for |
|-------|----------|---------|
| **Design contract (local)** | [`docs/api/`](./api/) | Field names, request bodies, response shapes, error codes |
| **User journeys** | [`user-journey-api.md`](./user-journey-api.md) | Persona flows, call order, headers |
| **Runtime OpenAPI** | `{VITE_API_URL base}/../docs/api.json` | Live schema when backend is running |
| **Canonical backend copy** | `../backend/docs/api/` | Re-sync when backend contract changes |

When in doubt, **runtime OpenAPI wins** over markdown if they disagree. Re-sync `docs/api/` from the backend repo after backend API changes.

## Re-sync command

```bash
cp -R ../backend/docs/api ./docs/
```

Then fix any broken cross-repo links in `docs/api/README.md` if needed.

---

## Before writing any hook or form

1. Read the task's API section in [`development-plan.md`](./development-plan.md).
2. Read the persona flow in [`user-journey-api.md`](./user-journey-api.md).
3. Open the matching endpoint file under [`docs/api/endpoints/`](./api/endpoints/).
4. Open the JSON schema under [`docs/api/schemas/`](./api/schemas/) for TypeScript types.
5. Read [`docs/api/conventions.md`](./api/conventions.md) for headers and pagination.
6. Read [`docs/api/errors.md`](./api/errors.md) for UI error handling.

---

## Request headers (frontend)

| Route group | Headers via `apiRequest()` |
|-------------|----------------------------|
| Public auth | none |
| Tenant (`/clients`, `/projects`, …) | `Authorization` + `freelancerId` → `X-Freelancer-Id` |
| Portal (`/portal/*`) | `Authorization` + `clientId` → `X-Client-Id` |
| Admin (`/admin/*`) | `Authorization` only |
| Subscription | `Authorization` + `freelancerId` |

Set `VITE_API_URL` in `.env` (see `.env.example`). Base path is always `/api/v1`.

---

## TypeScript types

Mirror API resource names from [`docs/api/schemas/`](./api/schemas/):

- Shared pagination/auth types → `src/types/api.ts`
- Feature-specific types → `src/features/{Feature}/types.ts`

Use the schema field names exactly — do not rename for “prettier” TS unless mapping at the UI boundary.

---

## MSW handlers

Create handlers in `src/test/msw/handlers/` that match endpoint paths and JSON shapes from `docs/api/endpoints/` + `docs/api/schemas/`.

Override per test with `server.use(...)`. Do not mock TanStack Query globally.

---

## Endpoint index (MVP)

| Group | Spec | Frontend feature (planned) |
|-------|------|------------------------------|
| Auth | [api/endpoints/auth.md](./api/endpoints/auth.md) | `features/Auth/` |
| Me | [api/endpoints/me.md](./api/endpoints/me.md) | `features/Auth/` |
| Settings | [api/endpoints/settings.md](./api/endpoints/settings.md) | Settings pages |
| Members | [api/endpoints/members.md](./api/endpoints/members.md) | `features/Members/` |
| Client members | [api/endpoints/client-members.md](./api/endpoints/client-members.md) | Client detail |
| Clients | [api/endpoints/clients.md](./api/endpoints/clients.md) | `features/Clients/` |
| Projects | [api/endpoints/projects.md](./api/endpoints/projects.md) | `features/Projects/` |
| Tasks | [api/endpoints/tasks.md](./api/endpoints/tasks.md) | Project detail |
| Time logs | [api/endpoints/time-logs.md](./api/endpoints/time-logs.md) | Time tracking |
| Client invoices | [api/endpoints/client-invoices.md](./api/endpoints/client-invoices.md) | `features/Invoices/` |
| Portal | [api/endpoints/portal.md](./api/endpoints/portal.md) | `features/Portal/` |
| Subscription | [api/endpoints/subscription.md](./api/endpoints/subscription.md) | `features/Subscription/` |
| Admin freelancers | [api/endpoints/admin-freelancers.md](./api/endpoints/admin-freelancers.md) | `features/Admin/` |
| Admin plans | [api/endpoints/admin-plans.md](./api/endpoints/admin-plans.md) | `features/Admin/` |

Planned (Phase 19): [reports.md](./api/endpoints/reports.md), [admin-reports.md](./api/endpoints/admin-reports.md).

Full index: [`docs/api/README.md`](./api/README.md).

---

## Error handling quick reference

| HTTP | `code` | Frontend action |
|------|--------|-----------------|
| 401 | `unauthenticated` | Clear token, redirect `/login` |
| 403 | `workspace_read_only` | Show ReadOnlyBanner, disable writes |
| 403 | `forbidden` | Toast + hide action |
| 422 | validation | Map `errors` to form fields |
| 422 | `plan_limit_exceeded` | Upgrade prompt |

Full catalog: [`docs/api/errors.md`](./api/errors.md). UI patterns: [`standards/error-handling.md`](./standards/error-handling.md).

---

## Agent checklist (per API task)

- [ ] Types match `docs/api/schemas/*.md`
- [ ] Hook uses `apiRequest()` with correct context header
- [ ] zod schema matches endpoint request body
- [ ] MSW handler returns schema-valid JSON
- [ ] Tests cover success, error, and header/invalidation cases
