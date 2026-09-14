# Definition of Done

Every task in [development-plan.md](../development-plan.md) must meet **universal criteria** plus **task-type criteria** plus **task-specific criteria** listed under that task.

---

## Universal Done (every task)

- [ ] Acceptance criteria for this task ID are all checked
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes (no new warnings in touched files)
- [ ] Follows [coding-conventions.md](./coding-conventions.md) and [naming-and-folders.md](./naming-and-folders.md)
- [ ] Follows [error-handling.md](./error-handling.md) for any API/UI errors touched
- [ ] Follows [security.md](./security.md) (no secrets, centralized auth)
- [ ] No `console.log`, commented-out code, or unexplained `@ts-ignore` / `any`
- [ ] Task-specific tests written and passing (see [testing-strategy.md](./testing-strategy.md))
- [ ] `lancehive-page-audit` deliverables produced if task ships user-facing UI
- [ ] If committing: message follows [commit-messages.md](./commit-messages.md) with task ID footer

---

## Task-type Done

### Foundation / infra (F-*)

- [ ] Documented in code or README if config-heavy
- [ ] Downstream tasks can import/use without duplication
- [ ] Tests for pure utilities (if any logic added)

### Types & query keys (*-01)

- [ ] Types mirror API schema names from `docs/user-journey-api.md`
- [ ] No `any`; optional fields marked `?` correctly
- [ ] Query key factory is hierarchical and exported
- [ ] Unit test: query key shape stable (snapshot or equality test)

### Hooks (*-02, *-03, S-01, etc.)

- [ ] Uses `apiRequest()` — no raw `fetch`
- [ ] Correct context header (`freelancerId` / `clientId`)
- [ ] Mutations invalidate smallest key set only
- [ ] Unit test: hook calls API with expected path/headers (MSW)
- [ ] Unit test: mutation invalidates correct keys on success

### Shared component (F-09–F-12, layout pieces)

- [ ] Props typed explicitly; sensible defaults
- [ ] Four states supported where applicable
- [ ] Unit test: renders loading/empty/error/happy (RTL)
- [ ] Accessible: labels, keyboard, focus in dialogs

### Page (*-Page, *-04, *-05)

- [ ] Four UI states: loading, empty, error, happy
- [ ] Composed from shadcn + shared components only
- [ ] Integration test: page renders each state with MSW
- [ ] Mobile-first layout checked at 375px

### Form dialog (*-FormDialog, *-04 invite)

- [ ] zod schema matches API validation
- [ ] 422 errors mapped to form fields
- [ ] Submit disabled while pending; read-only mode respected
- [ ] Unit test: validation rejects bad input
- [ ] Integration test: successful submit closes dialog + toast

### Route wiring (*-08, *-11)

- [ ] Route file imports page only — no business logic
- [ ] Correct guard (RequireAuth, RequireFreelancer, etc.)
- [ ] Integration test: unauthenticated redirect (if applicable)

### Guard / provider (A-09, S-03, PO-01)

- [ ] Single responsibility; no duplicate auth logic
- [ ] Unit/integration test: redirect or context value behavior

---

## Marking a task complete

1. Check all **task-specific** boxes in development-plan
2. Check all **task-type** boxes above
3. Check all **universal** boxes
4. Run `pnpm test` (or `pnpm test -- {pattern}` for scoped files)
5. Run audit skill if UI was added or changed
6. If user asks to commit: use `write-commit-message` skill per [commit-messages.md](./commit-messages.md)
