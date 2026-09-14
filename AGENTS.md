# LanceHive Frontend — Cursor Agent Guide

Follow on every task. Rules auto-load from `.cursor/rules/`; invoke skills from `.cursor/skills/`.

## Context — ask when blocked

If task scope, API, design, or environment is unclear after reading docs and code, **ask the project owner** — do not guess. See [context-request-protocol.md](./docs/context-request-protocol.md). Rule: `ask-for-context.mdc`.

## Quick Start

0. **Context check** — ask if blocked ([protocol](./docs/context-request-protocol.md))
1. Pick task ID from [docs/development-plan.md](./docs/development-plan.md)
2. Read task **Done when** + [standards/definition-of-done.md](./docs/standards/definition-of-done.md)
3. Read API in [docs/user-journey-api.md](./docs/user-journey-api.md) + [docs/api-endpoints.md](./docs/api-endpoints.md)
4. Implement using skill below
5. Write tests (`write-feature-tests`)
6. Verify all Done when + `pnpm test`
7. Audit with `lancehive-page-audit`
8. **Commit only if user asks** — use `write-commit-message`

## 10-step workflow

**Context** → Discover → Scaffold → Data → State → Compose → Styles → Test → Verify → **Commit** (on request)

Full guide: [docs/agentic-workflow.md](./docs/agentic-workflow.md)

## Standards (required reading)

| Doc | Topic |
|-----|-------|
| [standards/definition-of-done.md](./docs/standards/definition-of-done.md) | Universal + task-type DoD |
| [standards/testing-strategy.md](./docs/standards/testing-strategy.md) | Vitest + RTL + MSW |
| [standards/error-handling.md](./docs/standards/error-handling.md) | API + UI errors |
| [standards/coding-conventions.md](./docs/standards/coding-conventions.md) | TS/React style |
| [standards/naming-and-folders.md](./docs/standards/naming-and-folders.md) | Files + symbols |
| [standards/security.md](./docs/standards/security.md) | Auth, secrets |
| [standards/commit-messages.md](./docs/standards/commit-messages.md) | Conventional Commits |
| [design-direction.md](./docs/design-direction.md) | UI style, layout, tokens |

## Skills by task

| Task | Skill |
|------|-------|
| New page | `build-feature-page` |
| API hooks | `api-feature-integration` |
| List page | `implement-list-page` |
| Form dialog | `implement-crud-dialog` |
| Tests | `write-feature-tests` |
| Pre-ship | `lancehive-page-audit` |
| Git commit | `write-commit-message` |

## Cursor rules

| Rule | Scope |
|------|-------|
| `lancehive-core.mdc` | Always |
| `ai-token-guard.mdc` | Always — minimal reads/output |
| `ask-for-context.mdc` | Always |
| `security.mdc` | Always |
| `commit-messages.mdc` | when committing |
| `build-page-workflow.mdc` | `src/features/**` |
| `coding-conventions.mdc` | `src/**` |
| `naming-and-folders.mdc` | `src/**` |
| `error-handling.mdc` | `src/**` |
| `testing.mdc` | `*.test.*`, `src/test/**` |
| `api-integration.mdc` | hooks, lib |
| `routing-auth.mdc` | routes, Auth |
| `audit-deliverables.mdc` | audits |

## Verify before marking done

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test -- {FeatureName}
```

All task **Done when** checkboxes must be checked.

## Commit (when user asks)

```
feat(clients): add ClientsPage with cursor pagination

Task: C-04
```

See [standards/commit-messages.md](./docs/standards/commit-messages.md). Skill: `write-commit-message`.
