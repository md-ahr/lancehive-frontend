---
name: lancehive-page-audit
description: Audits a LanceHive page or feature against five areas plus tests, errors, and security. Use before marking a development-plan task done or when the user asks for a page review.
---

# LanceHive Page Audit

Prerequisites: task **Done when** from `docs/development-plan.md` should already be checked.

## Five areas (+ tests, errors, security)

Rate issues 🔴 🟠 🟡 🟢

### 1. Architecture
Route → Page → Hooks → Components; feature folder; centralized auth

### 2. Component composition
shadcn/shared only; no hand-rolled controls

### 3. State & data
TanStack Query; query-keys.ts; Zustand UI-only; RHF + zod

### 4. Performance & UX
Cursor pagination; skeletons; empty states; staleTime

### 5. Code quality, tests & a11y
Strict TS; ~150 lines; labels; tests for 4 states + errors; `pnpm test` green

### 6. Error handling (checklist)
- [ ] 401/403/422 handled per `error-handling.mdc`
- [ ] No stack traces in UI
- [ ] Integration test covers error state

### 7. Security (checklist)
- [ ] No secrets in code; token via auth-storage only
- [ ] zod validation before submit
- [ ] Unauthorized actions hidden + 403 handled

## Required deliverables

1. Severity-ranked issues with file:line
2. Top 3 fixes
3. Component tree
4. Data-flow diagram
5. One positive observation
6. Checklists: four UI states + tests run

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm test -- {feature}
```
