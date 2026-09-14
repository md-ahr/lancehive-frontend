# LanceHive Frontend

React 19 + TypeScript + Vite SPA for the LanceHive freelancer workspace platform.

## Agentic workflow (Cursor)

Start here when using Cursor agents:

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](./AGENTS.md) | Skills, rules, verify commands |
| [Development plan](./docs/development-plan.md) | Tasks with **Done when** checklists |
| [Agentic workflow](./docs/agentic-workflow.md) | 10-step build process + audit |
| [Context request protocol](./docs/context-request-protocol.md) | When agents must ask you for missing context |
| [API endpoints guide](./docs/api-endpoints.md) | How agents use the API contract |
| [API user journey](./docs/user-journey-api.md) | Persona flows and call order |
| [API contract](./docs/api/) | Per-route specs + JSON schemas |
| [Pages & routes](./docs/pages-and-routes.md) | Route map and component inventory |
| [Standards](./docs/standards/) | DoD, testing, errors, security, conventions |

**Cursor rules:** `.cursor/rules/` (auto-loaded; `ai-token-guard.mdc` = minimal reads) · **Skills:** `.cursor/skills/` (invoke per task)

## Development

```bash
pnpm install
cp .env.example .env   # set VITE_API_URL to your backend
pnpm dev
```

### Verify before marking a task done

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test -- {FeatureName}
```

### Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Production build |
| `pnpm check` | Typecheck + lint + format check |
| `pnpm test` | Vitest (all tests) |
| `pnpm test:watch` | Vitest watch mode |

## Stack

React 19 · TypeScript · TanStack Query · Zustand · React Router · Tailwind CSS · shadcn/ui · Vitest · MSW

## Backend

API runs separately (Laravel Sail). Default local base URL is typically `http://localhost/api/v1` — confirm against your backend `.env` `APP_URL`.
