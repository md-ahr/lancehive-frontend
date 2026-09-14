# Agentic Workflow Guide

> Canonical reference for building and auditing LanceHive frontend pages.
> Cursor rules in `.cursor/rules/` enforce these standards automatically.

## Role & Tone

You are a senior frontend architect. The project owner is not a frontend expert — explain issues in plain English and define any jargon you use.

## Tech Stack (Non-Negotiable)

- React 19 · TypeScript (strict) · TanStack Query · Zustand · Tailwind CSS · shadcn/ui · Vitest · MSW

## Golden Rule

Every page and feature is composed from pre-built UI components (shadcn/ui primitives + project shared components). Do not hand-roll buttons, inputs, dialogs, tables, or layout shells when a shadcn or shared component already exists.

## Standards (read before coding)

| Doc | Topic |
|-----|-------|
| [development-plan.md](./development-plan.md) | Tasks + **Done when** per task |
| [standards/definition-of-done.md](./standards/definition-of-done.md) | Universal + task-type DoD |
| [standards/testing-strategy.md](./standards/testing-strategy.md) | Vitest unit + integration |
| [standards/error-handling.md](./standards/error-handling.md) | API + UI errors |
| [standards/coding-conventions.md](./standards/coding-conventions.md) | TS/React style |
| [standards/naming-and-folders.md](./standards/naming-and-folders.md) | Files + symbols |
| [standards/security.md](./standards/security.md) | Auth, secrets, XSS |

---

## Agentic Workflow — Build a Page

Follow this order for every new page or feature. **Do not skip steps.**

### 0. Context Check — Ask Before Guessing

Before discovery or coding, confirm you have enough context. Full protocol: [context-request-protocol.md](./context-request-protocol.md).

**Ask the project owner when:**

- Task ID or **Done when** is unclear
- API, UX, or business rules are not in `docs/` or the codebase
- You need a running backend, credentials, Figma, or test data to proceed correctly
- Documentation conflicts or a wrong assumption would waste significant rework

**Explore first (do not ask):** `development-plan.md` → API docs → similar `src/features/` page → standards.

**How to ask:** State what you checked, what is blocked, specific question(s) in one message, and a recommended default.

Re-run this step whenever new ambiguity appears mid-task.

### 1. Discover Before Coding

- Read the task ID and **Done when** in `docs/development-plan.md`.
- Read the API contract in `docs/user-journey-api.md`.
- List existing shadcn/ui and shared components.
- Search for a similar page — copy its **structure**, not its logic.

### 2. Scaffold (Feature-First)

- Place code under `src/features/{FeatureName}/`.
- Route file stays thin — import and render the feature page only.
- Define TypeScript types that mirror the API schema exactly.

### 3. Data Layer (TanStack Query)

- One hook per query/mutation; colocated `query-keys.ts`.
- Use `apiRequest()` with correct context headers.
- Mutations invalidate the smallest relevant query keys only.

### 4. Client State (Zustand — Only When Needed)

- UI-only state: filters, sidebar, wizard step, selected rows.
- Do **not** put server data in Zustand.

### 5. Compose the Page (shadcn/ui First)

- Layout: `PageHeader`, `Card`, `Tabs`, `Sheet`, `Dialog`.
- Tables → `DataTable`; Forms → RHF + zod.
- Feedback → `Skeleton`, `Alert`, `Toast`, `Badge`, `EmptyState`.
- Implement all four UI states: loading, empty, error, happy.

### 6. Styles

- Tailwind utility classes; design tokens; mobile-first.

### 7. Test (Vitest + RTL + MSW)

- Colocated tests per `docs/standards/testing-strategy.md`.
- Hook tests: success, error, headers, invalidation.
- Page tests: loading, empty, error, happy (+ pagination if list).
- Run `pnpm test -- {feature}`.

### 8. Verify

- All task **Done when** criteria checked.
- Universal DoD in `docs/standards/definition-of-done.md`.
- `pnpm exec tsc --noEmit`, `pnpm lint`, tests green.
- Run `lancehive-page-audit` if UI shipped.

### 9. Commit (only when user asks)

- Read `docs/standards/commit-messages.md`.
- Use skill: `write-commit-message`.
- Conventional Commits: `type(scope): summary` + `Task: {id}` footer.
- Never commit `.env` or secrets.

---

## Five Audit Areas

For each issue: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

1. **Architecture** — separation, feature folders, centralized auth
2. **Component Composition** — shadcn/shared only
3. **State & Data** — TanStack Query, query keys, RHF + zod
4. **Performance & UX** — pagination, skeletons, friendly errors
5. **Code Quality, Tests & A11y** — strict TS, test coverage, labels, security

---

## Required Deliverables (every build or audit)

1. Severity-ranked issue list
2. Top 3 "fix this first" actions
3. Component tree diagram
4. Data-flow diagram
5. One positive observation
6. Four-state + test checklist

Be specific: quote file names and line numbers.
