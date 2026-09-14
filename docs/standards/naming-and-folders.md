# Naming & Folders

Feature-first layout. One feature = one folder under `src/features/`.

---

## Directory tree

```
src/
  app/                    → providers, root layout wiring
  features/{FeatureName}/
    pages/                → {Entity}Page.tsx
    components/           → feature-only UI
    hooks/                → use{Entity}{Action}.ts + *.test.ts
    stores/               → use{Feature}Store.ts (UI state only)
    types.ts
    query-keys.ts
  components/
    ui/                   → shadcn CLI only — do not edit logic
    {Shared}.tsx          → cross-feature shared
  lib/                    → api, auth-storage, utils, errors
  routes/                 → thin route config
  test/                   → setup, MSW handlers, test-utils
  types/                  → shared API types (api.ts)
```

## File naming

| Kind | Pattern | Example |
|------|---------|---------|
| Page | `{Entity}Page.tsx` | `ClientsPage.tsx` |
| Feature component | `{Name}.tsx` | `ClientFormDialog.tsx` |
| Shared component | `{Name}.tsx` | `PageHeader.tsx` |
| Hook | `use{Entity}{Action}.ts` | `useClientList.ts` |
| Hook test | `use{Entity}{Action}.test.ts` | `useClientList.test.ts` |
| Component test | `{Name}.test.tsx` | `ClientsPage.test.tsx` |
| Store | `use{Feature}Store.ts` | `useAuthStore.ts` |
| Types | `types.ts` | per feature |
| Query keys | `query-keys.ts` | per feature |
| MSW handler | `{feature}.handlers.ts` | `clients.handlers.ts` |

## Symbol naming

| Kind | Pattern | Example |
|------|---------|---------|
| React component | PascalCase | `ClientFormDialog` |
| Hook | camelCase `use*` | `useCreateClient` |
| Query key factory | `{entity}Keys` | `clientKeys` |
| Zod schema | `{entity}Schema` | `clientFormSchema` |
| API types | PascalCase, match API | `Client`, `PaginatedResponse` |
| Event handler | `handle{Action}` | `handleSubmit` |
| Boolean prop | `is/has/can` prefix | `isLoading`, `canEdit` |

## Feature folder names

PascalCase, singular domain noun:

`Auth`, `Clients`, `Projects`, `Tasks`, `TimeLogs`, `Invoices`, `Members`, `Settings`, `Workspace`, `Layout`, `Portal`, `Subscription`, `Admin`

Admin sub-features: `features/Admin/Freelancers/`, `features/Admin/Plans/`

## Routes

- kebab-case paths: `/app/clients`, `/app/client-invoices`
- Param names match API: `:clientId`, `:projectId` (or `:id` if consistent in feature)

## Tests

Colocate with source:

```
features/Clients/hooks/useClientList.test.ts
features/Clients/pages/ClientsPage.test.tsx
```

Shared test utilities: `src/test/test-utils.tsx`, `src/test/setup.ts`
