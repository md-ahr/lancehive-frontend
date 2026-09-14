# LanceHive Frontend — Development Plan

> Derived from [user-journey-api.md](./user-journey-api.md). One task = one Cursor session.
>
> **Before starting a task:** read its **Done when** below + [standards/definition-of-done.md](./standards/definition-of-done.md).
>
> **Workflow:** **Context** (ask if blocked) → Discover → Scaffold → Data → State → Compose → Styles → **Test** → Verify → Audit
>
> **Context:** See [context-request-protocol.md](./context-request-protocol.md) — agents must ask the owner when task scope, API, design, or environment is unclear.

---

## Overview

| Area | Persona | Routes | Priority |
|------|---------|--------|----------|
| Foundation | All | — | P0 |
| Auth | All | `/login`, `/forgot-password`, `/reset-password` | P0 |
| Tenant | Owner/Member | `/app/*` | P1 |
| Portal | Client | `/portal/*` | P2 |
| Subscription | Owner | `/app/subscription` | P2 |
| Admin | Super admin | `/admin/*` | P3 |

**Skills:** `build-feature-page` · `api-feature-integration` · `implement-list-page` · `implement-crud-dialog` · `write-feature-tests` · `lancehive-page-audit` · `write-commit-message` (on user request)

---

## Phase 0 — Foundation (P0) ✅

### F-01 — Install stack
**Output:** `package.json`, `components.json`, Tailwind config
**Depends:** — | **Tests:** N/A

**Done when:**
- [x] Tailwind, shadcn, TanStack Query, Zustand, React Router, RHF, zod, sonner installed
- [x] `pnpm dev` starts without errors
- [x] `components.json` uses `@/` alias

---

### F-02 — Path alias `@/`
**Output:** `vite.config.ts`, `tsconfig.app.json`
**Depends:** F-01 | **Tests:** N/A

**Done when:**
- [x] `@/` resolves to `src/` in Vite and TypeScript
- [x] Sample import from `@/lib/utils` compiles

---

### F-03 — App providers
**Output:** `src/app/providers.tsx`
**Depends:** F-01 | **Tests:** integration smoke optional

**Done when:**
- [x] QueryClientProvider with global error defaults (401 handler stub)
- [x] BrowserRouter wraps app
- [x] Toaster (sonner) mounted

---

### F-04 — API client + error helpers
**Output:** `lib/api.ts`, `lib/errors.ts`, `lib/api-types.ts`
**Depends:** — | **Tests:** unit

**Done when:**
- [x] `apiRequest()` throws `ApiError` with status + body
- [x] `getErrorCode`, `getUserMessage`, `isValidationError`, `mapValidationErrorsToForm` implemented
- [x] Unit tests for error helpers (all HTTP codes in cheat sheet)

---

### F-05 — Auth storage
**Output:** `lib/auth-storage.ts`
**Depends:** F-04 | **Tests:** unit

**Done when:**
- [x] `getToken`, `setToken`, `clearToken` — single module only
- [x] Unit tests: set/get/clear cycle

---

### F-06 — Global API types
**Output:** `src/types/api.ts`
**Depends:** F-04 | **Tests:** unit (type tests optional)

**Done when:**
- [x] `User`, `MeResponse`, `PaginatedResponse<T>`, `ApiErrorBody` defined
- [x] Match shapes in `user-journey-api.md`

---

### F-07 — Route skeleton
**Output:** `src/routes/index.tsx`
**Depends:** F-03 | **Tests:** integration

**Done when:**
- [x] Route groups: public, `/app`, `/portal`, `/admin` with placeholder pages
- [x] Unknown route → 404 page
- [x] Integration test: each group renders placeholder

---

### F-08 — Core shadcn primitives
**Output:** `src/components/ui/*`
**Depends:** F-01 | **Tests:** N/A

**Done when:**
- [x] button, input, label, form, card, skeleton, alert, badge installed via CLI
- [x] Files unmodified except Tailwind classes

---

### F-09 — PageHeader, EmptyState, ErrorAlert, LoadingSkeleton
**Output:** `src/components/*.tsx`
**Depends:** F-08 | **Tests:** component

**Done when:**
- [x] Each component exported with typed props
- [x] Component tests: render happy path for each
- [x] ErrorAlert accepts `ApiError` and shows retry when `onRetry` passed

---

### F-10 — CursorPagination
**Output:** `src/components/CursorPagination.tsx`
**Depends:** F-06, F-08 | **Tests:** component

**Done when:**
- [x] Prev/next disabled when `meta.prev_cursor` / `meta.next_cursor` null
- [x] Component test: button disabled/enabled states

---

### F-11 — ReadOnlyBanner
**Output:** `src/components/ReadOnlyBanner.tsx`
**Depends:** F-08 | **Tests:** component

**Done when:**
- [x] Shows subscription lapsed message + link to `/app/subscription`
- [x] Component test: renders message and link

---

### F-12 — ConfirmDialog
**Output:** `src/components/ConfirmDialog.tsx`
**Depends:** F-08 | **Tests:** component

**Done when:**
- [x] AlertDialog wrapper with title, description, confirm/cancel
- [x] Component test: confirm calls `onConfirm`

---

### F-13 — Vitest + MSW setup
**Output:** `vite.config.ts` (test block), `src/test/*`
**Depends:** F-02 | **Tests:** N/A (infra)

**Done when:**
- [x] Vitest + RTL + jsdom + MSW installed; scripts `test`, `test:watch`, `test:coverage`
- [x] `src/test/setup.ts`, `test-utils.tsx` with `renderWithProviders`
- [x] `src/test/msw/server.ts` + sample handler
- [x] `pnpm test` runs (even if zero tests)

**Phase 0 exit:** App boots; shared components tested; `pnpm test` works. ✅

---

## Phase 1 — Auth & Session (P0) ✅

### A-01 — Auth types + query keys
**Folder:** `features/Auth/` | **Depends:** F-06

**Done when:**
- [x] `types.ts`: LoginRequest, LoginResponse, MeResponse re-exports
- [x] `query-keys.ts`: `authKeys.me()`, `authKeys.all`
- [x] Unit test: query key shapes

---

### A-02 — useLogin, useLogout
**API:** `POST /login`, `POST /logout` | **Depends:** A-01, F-05

**Done when:**
- [x] Login stores token via auth-storage; logout clears token
- [x] Hook tests: success, 401 error, logout clears token

---

### A-03 — useMe
**API:** `GET /me` | **Depends:** A-01

**Done when:**
- [x] Query enabled only when token present
- [x] Hook tests: success with memberships; 401 error

---

### A-04 — Auth store (token UI flag only)
**Folder:** `features/Auth/stores/` | **Depends:** F-05

**Done when:**
- [x] Store holds token presence / hydrated flag only — not `MeResponse`
- [x] Unit test: hydrate from storage

---

### A-05 — LoginPage + LoginForm
**Depends:** A-02, A-08

**Done when:**
- [x] zod: email + password required
- [x] Four states: loading submit, validation error, API error, success redirect
- [x] Integration tests: render form, validation fail, login success (MSW)

---

### A-06 — ForgotPasswordPage
**API:** `POST /forgot-password` | **Depends:** A-08

**Done when:**
- [x] Always shows success message (no email enumeration)
- [x] Integration tests: submit success

---

### A-07 — ResetPasswordPage
**API:** `POST /reset-password` | **Depends:** A-08

**Done when:**
- [x] Fields: token, email, password, password_confirmation
- [x] zod password match validation
- [x] Integration tests: validation fail, success

---

### A-08 — AuthLayout
**Depends:** F-08

**Done when:**
- [x] Centered card layout for public auth pages
- [x] Component test: renders children

---

### A-09 — RequireAuth guard
**Depends:** A-03

**Done when:**
- [x] Redirects to `/login` when no token or useMe fails
- [x] Integration test: redirect when unauthenticated

---

### A-10 — PersonaRedirect
**Depends:** A-03

**Done when:**
- [x] super_admin → `/admin`; client → `/portal`; freelancer → `/app`
- [x] Integration test: each role redirects correctly (MSW me fixtures)

---

### A-11 — Wire public routes
**Depends:** A-05–A-07

**Done when:**
- [x] `/login`, `/forgot-password`, `/reset-password` wired with AuthLayout
- [x] Integration test: routes render correct pages

**Phase 1 exit:** Login → /me → persona redirect; logout; 401 → login. ✅

---

## Phase 2 — App Shell (P1) ✅

### S-01 — useUpdateMeSettings | **API:** `PATCH /me/settings`
**Done when:**
- [x] Hook + MSW tests; invalidates `authKeys.me()`

### S-02 — Workspace settings hooks | **API:** `GET/PATCH /workspace/settings`
**Done when:**
- [x] Hook + MSW tests; owner-only mutation guard in hook caller

### S-03 — WorkspaceProvider
**Done when:**
- [x] Provides `freelancerId`; persists selection; integration test context value

### S-04 — WorkspaceSwitcher
**Done when:**
- [x] Dropdown when memberships > 1; hidden when single; component test

### S-05 — AppLayout
**Done when:**
- [x] Sidebar nav, breadcrumb, switcher, ReadOnlyBanner when read_only; component test

### S-06 — UserMenu
**Done when:**
- [x] Settings link, logout; component test

### S-07 — RequireFreelancer + read-only guard
**Done when:**
- [x] Blocks tenant routes for wrong role; write hooks respect read_only; integration tests

### S-08 — DashboardPage
**Done when:**
- [x] Placeholder cards; loading skeleton; integration test render

### S-09 — UserSettingsPage
**Done when:**
- [x] Form timezone/locale; four states; integration tests

### S-10 — WorkspaceSettingsPage
**Done when:**
- [x] Owner/admin gate; form PATCH; 403 handled; integration tests

### S-11 — Wire `/app/*`
**Done when:**
- [x] Nested routes under AppLayout + RequireFreelancer; integration test navigation

**Phase 2 exit:** Workspace switcher sets header; read-only banner works. ✅

---

## Phase 3 — Members (P1) ✅

### M-01 — Types + query keys
**Done when:**
- [x] Member types; `memberKeys`; key unit test

### M-02 — useMemberList, useInviteMember | **API:** `GET/POST /members`
**Done when:**
- [x] Hook MSW tests; invite invalidates list

### M-03 — MembersPage
**Done when:**
- [x] DataTable; four states; cursor pagination; integration tests (all 4 states)

### M-04 — InviteMemberDialog
**Done when:**
- [x] email + role; 422 mapping; integration tests

### M-05 — Route `/app/members`
**Done when:**
- [x] Wired; integration test load page

**Phase 3 exit:** List + invite; 403 for non-admin shows toast. ✅

---

## Phase 4 — Clients (P1) ✅

### C-01 — Types + query keys
**Done when:**
- [x] Client, ClientList types; `clientKeys`; key test

### C-02 — useClientList | **API:** `GET /clients`
**Done when:**
- [x] Cursor param; header; hook MSW tests

### C-03 — Client CRUD hooks
**Done when:**
- [x] get/create/update/delete; invalidation; hook tests each mutation

### C-04 — ClientsPage
**Done when:**
- [x] List + pagination + four states; integration tests (5 cases incl. pagination)

### C-05 — ClientFormDialog
**Done when:**
- [x] create/edit; 422; read_only disabled; integration tests

### C-06 — ClientDetailPage
**Done when:**
- [x] Header + tabs shell; loading/error/not-found; integration tests

### C-07 — DeleteClientDialog
**Done when:**
- [x] ConfirmDialog; delete mutation; integration test

### C-08 — Routes `/app/clients`, `/app/clients/:id`
**Done when:**
- [x] Wired; integration test navigation

**Phase 4 exit:** Full CRUD; cursor pagination; all tests green. ✅

---

## Phase 5 — Projects (P1) ✅

### P-01 — Types + query keys
**Done when:**
- [x] Project types; `projectKeys`; key test

### P-02 — useProjectList, useClientProjects
**Done when:**
- [x] Both list hooks + MSW tests

### P-03 — Project CRUD hooks
**Done when:**
- [x] Nested create under client; hook tests

### P-04 — ProjectsPage
**Done when:**
- [x] Cross-client table; four states + pagination tests

### P-05 — ClientProjectsTab
**Done when:**
- [x] Tab on ClientDetailPage; integration tests

### P-06 — ProjectFormDialog
**Done when:**
- [x] Client selector on global create; form tests

### P-07 — ProjectDetailPage
**Done when:**
- [x] Tabs shell (Tasks, Time, Invoices); integration tests

### P-08 — Routes
**Done when:**
- [x] `/app/projects`, `/app/projects/:id` wired + test

**Phase 5 exit:** Client → Project navigation works. ✅

---

## Phase 6 — Tasks (P1) ✅

### T-01 — Types + query keys
**Done when:**
- [x] Task types; `taskKeys`; key test

### T-02 — Task CRUD hooks
**Done when:**
- [x] Project-scoped; hook MSW tests

### T-03 — ProjectTasksTab
**Done when:**
- [x] DataTable; four states; integration tests

### T-04 — TaskFormDialog
**Done when:**
- [x] CRUD dialog tests (validation, 422, success)

### T-05 — TaskDetailPage or Sheet
**Done when:**
- [x] Shows task + time logs section; integration tests

**Phase 6 exit:** Tasks under project; CRUD tested. ✅

---

## Phase 7 — Time Logs (P1) ✅

### TL-01 — Types + query keys
**Done when:**
- [x] TimeLog types; `timeLogKeys`; key test

### TL-02 — Time log hooks
**Done when:**
- [x] Task time-logs CRUD hooks; hook MSW tests

### TL-03 — useProjectTimeSummary
**Done when:**
- [x] Hook test; unbilled hours shape

### TL-04 — TimeLogForm
**Done when:**
- [x] hours, description, logged_at; zod; form tests

### TL-05 — TimeLogsList
**Done when:**
- [x] DataTable; four states; component/integration tests

### TL-06 — TimeSummaryCard
**Done when:**
- [x] Displays summary; loading/error; component test

**Phase 7 exit:** Log time; view summary on project. ✅

---

## Phase 8 — Invoices (P1) ✅

### I-01 — Types + query keys
**Done when:**
- [x] Invoice types; `invoiceKeys`; key test

### I-02 — List + detail hooks
**Done when:**
- [x] MSW tests

### I-03 — useCreateClientInvoice
**Done when:**
- [x] prefill_unbilled_time option; hook test

### I-04 — Invoice mutation hooks
**Done when:**
- [x] update, add item, payment, void; hook tests each

### I-05 — InvoicesPage
**Done when:**
- [x] Status badges + filter; four states + pagination tests

### I-06 — InvoiceDetailPage
**Done when:**
- [x] Items table, balance, actions; integration tests all states

### I-07 — CreateInvoiceDialog
**Done when:**
- [x] prefill toggle; integration tests

### I-08 — AddInvoiceItemDialog, RecordPaymentDialog
**Done when:**
- [x] Form tests each

### I-09 — InvoiceStatusActions
**Done when:**
- [x] draft→sent, void confirm; integration tests

### I-10 — ProjectInvoicesTab
**Done when:**
- [x] Tab integration tests

### I-11 — Routes
**Done when:**
- [x] `/app/invoices`, `/app/invoices/:id` + tests

**Phase 8 exit:** Invoice lifecycle draft → sent → payment; tests green. ✅

---

## Phase 9 — Client Portal Members (P1) ✅

### CM-01 — Client member hooks | **API:** `GET/POST /clients/{client}/members`
**Done when:**
- [x] `useClientMemberList`, `useInviteClientMember`; MSW tests; invite invalidates list

### CM-02 — ClientMembersTab | **Done when:**
- [x] `ClientMembersTable`, `InviteClientMemberDialog`; four states; integration tests

**Phase 9 exit:** Invite client contact to portal. ✅

---

## Phase 10 — Portal (P2)

### PO-01 — PortalProvider | **Done when:** `clientId` context; integration test

### PO-02 — ClientSwitcher | **Done when:** Multi-client dropdown; component test

### PO-03 — PortalLayout | **Done when:** Read-only shell; no write buttons; component test

### PO-04 — Portal hooks | **API:** `/portal/*` | **Done when:** client, projects, invoices hooks + MSW tests

### PO-05 — PortalDashboardPage | **Done when:** Profile card; four states; integration tests

### PO-06 — PortalProjectsPage | **Done when:** Read-only table; integration tests

### PO-07 — PortalInvoicesPage | **Done when:** Status filter; no drafts; integration tests

### PO-08 — RequireClient | **Done when:** Guard integration test

### PO-09 — Wire `/portal/*` | **Done when:** Routes + integration navigation test

**Phase 10 exit:** Client sees read-only data only.

---

## Phase 11 — Subscription (P2)

### SUB-01 — Subscription hooks | **Done when:** GET subscription; MSW test

### SUB-02 — Checkout/cancel/swap mutations | **Done when:** Hook tests each

### SUB-03 — SubscriptionPage | **Done when:** Owner gate; plan status; four states; integration tests

### SUB-04 — Checkout redirect | **Done when:** Opens checkout_url; unit test window.location assign mock

### SUB-05 — Route `/app/subscription` | **Done when:** Wired + integration test

**Phase 11 exit:** Owner checkout flow; writable when workspace read-only.

---

## Phase 12 — Admin (P3)

### AD-01 — RequireSuperAdmin | **Done when:** Integration test redirect non-admin

### AD-02 — AdminLayout | **Done when:** Component test render

### AD-03 — Freelancer admin hooks | **Done when:** CRUD + resend + subscription PATCH; hook tests

### AD-04 — FreelancersPage + CreateFreelancerDialog | **Done when:** Integration tests full flow

### AD-05 — ResendInviteButton, subscription override | **Done when:** Component/integration tests

### AD-06 — Plan admin hooks | **Done when:** CRUD hook tests

### AD-07 — PlansPage + PlanFormDialog | **Done when:** Integration tests

### AD-08 — Wire `/admin/*` | **Done when:** Routes + integration tests

**Phase 12 exit:** Admin creates workspace + manages plans.

---

## Sprint order

| Sprint | Tasks | Goal |
|--------|-------|------|
| 1 | F-01 → F-13 | Foundation + test infra |
| 2 | A-01 → A-11, S-01 → S-11 | Auth + shell |
| 3 | C-01 → C-08, M-01 → M-05 | Clients + members |
| 4 | P-01 → P-08, T-01 → T-05 | Projects + tasks |
| 5 | TL-01 → TL-06, I-01 → I-11 | Time + invoices |
| 6 | CM-01 → CM-02, PO-01 → PO-09 | Portal |
| 7 | SUB-01 → SUB-05, AD-01 → AD-08 | Subscription + admin |

---

## References

- [pages-and-routes.md](./pages-and-routes.md)
- [user-journey-api.md](./user-journey-api.md)
- [agentic-workflow.md](./agentic-workflow.md)
- [standards/](./standards/) — DoD, testing, errors, naming, security, conventions
- `.cursor/rules/` · `.cursor/skills/`
