---
name: build-feature-page
description: Builds a LanceHive feature page using the 8-step agentic workflow. Use when creating a new page, feature module, or route under src/features/, or when implementing a task from docs/development-plan.md.
---

# Build Feature Page

## Before coding

0. **Context check** — if task ID, API, design, or environment is unclear after reading docs/code, ask the owner per `docs/context-request-protocol.md` (do not guess)
1. Read task **Done when** in `docs/development-plan.md`
2. Read `docs/standards/definition-of-done.md` (universal + task-type)
3. Read API in `docs/user-journey-api.md`
4. Check `docs/pages-and-routes.md` for names

## 10-step checklist

```
- [ ] 0. Context — asked owner if blocked; explored docs/code first
- [ ] 1. Discover — task AC, API, similar page, shadcn inventory
- [ ] 2. Scaffold — features/{Name}/ structure
- [ ] 3. Data layer — hooks + query-keys + apiRequest
- [ ] 4. Client state — Zustand only if UI filters needed
- [ ] 5. Compose — four UI states, shadcn + shared
- [ ] 6. Styles — Tailwind tokens, mobile-first
- [ ] 7. Test — Vitest + RTL + MSW (write-feature-tests skill)
- [ ] 8. Verify — all Done when checked, tsc, lint, test, audit
- [ ] 9. Commit — only if user asks; use write-commit-message skill
```

## Standards to follow

| Topic | Doc / rule |
|-------|------------|
| Naming | `docs/standards/naming-and-folders.md` |
| Errors | `docs/standards/error-handling.md` |
| Security | `docs/standards/security.md` |
| Tests | `docs/standards/testing-strategy.md` |
| Commits | `docs/standards/commit-messages.md` (when user asks to commit) |

## Mark task complete only when

- Every checkbox in task **Done when** is checked
- Universal DoD satisfied
- `pnpm test -- {Feature}` passes
