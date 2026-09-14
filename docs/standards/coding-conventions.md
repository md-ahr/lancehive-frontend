# Coding Conventions

TypeScript and React standards for LanceHive frontend.

---

## TypeScript

- **Strict mode** — no exceptions
- **No `any`** — use `unknown` + narrow, or proper generics
- **`@ts-ignore`** — forbidden unless commented with reason + ticket
- **Explicit exports** — prefer named exports for components/hooks
- **Types vs interfaces** — `type` for unions/API shapes; `interface` for extendable props
- **Enums** — avoid; use string union types (`type Status = 'draft' | 'sent'`)

## React

- **Functional components only** — no class components
- **Hooks rules** — no conditional hooks; custom hooks prefixed `use`
- **Props** — destructure in signature; export `type XxxProps` when reused
- **File size** — ~150 lines max per component; split if larger
- **Memoization** — only when measured or obvious (large lists, context values)
- **Keys** — stable IDs from data, never array index for dynamic lists

## Imports

Order (blank line between groups):

```typescript
// 1. External packages
import { useQuery } from '@tanstack/react-query'

// 2. Internal absolute (@/)
import { apiRequest } from '@/lib/api'
import { Button } from '@/components/ui/button'

// 3. Relative (same feature)
import { clientKeys } from '../query-keys'
import type { Client } from '../types'
```

- Use `@/` alias for anything outside current feature folder
- Type-only imports: `import type { ... }`

## Formatting

- Match existing file style (semicolons, quotes)
- Tailwind class order: layout → spacing → typography → color → state
- Prefer early returns for loading/error states

## Comments

- Self-documenting names over comments
- Comment only: non-obvious business rules, API quirks, workarounds

## Forbidden patterns

```typescript
// ❌ useEffect + fetch for server data
useEffect(() => { fetch('/api/clients').then(...) }, [])

// ❌ Server data in Zustand
useClientStore.setState({ clients: data })

// ❌ Inline query keys
useQuery({ queryKey: ['clients', id] })

// ❌ Raw HTML form controls when shadcn exists
<button onClick={...}>
<input type="text" />
```

## Verification

```bash
pnpm exec tsc --noEmit
pnpm lint
```
