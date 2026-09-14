# Features

Each feature lives in its own folder:

```
{FeatureName}/
  pages/           → {Feature}Page.tsx
  components/      → feature-specific UI
  hooks/           → TanStack Query hooks
  stores/          → Zustand (UI state only)
  types.ts         → API-mirrored types
  query-keys.ts    → query key factory
```

See [docs/agentic-workflow.md](../../docs/agentic-workflow.md) for the full build workflow.
