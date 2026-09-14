# Pages & Routes Map

> Route inventory aligned with [user-journey-api.md](./user-journey-api.md) and [development-plan.md](./development-plan.md).

---

## Route Tree

```
/                           → redirect by auth state
├── /login                  → LoginPage
├── /forgot-password        → ForgotPasswordPage
├── /reset-password         → ResetPasswordPage
│
├── /app                    → AppLayout (RequireAuth + RequireFreelancer)
│   ├── /app                  → DashboardPage
│   ├── /app/clients          → ClientsPage
│   ├── /app/clients/:id      → ClientDetailPage
│   ├── /app/projects         → ProjectsPage
│   ├── /app/projects/:id     → ProjectDetailPage
│   ├── /app/invoices         → InvoicesPage
│   ├── /app/invoices/:id     → InvoiceDetailPage
│   ├── /app/members          → MembersPage
│   ├── /app/settings         → UserSettingsPage
│   ├── /app/workspace        → WorkspaceSettingsPage
│   └── /app/subscription     → SubscriptionPage (owner only)
│
├── /portal                 → PortalLayout (RequireAuth + RequireClient)
│   ├── /portal               → PortalDashboardPage
│   ├── /portal/projects      → PortalProjectsPage
│   └── /portal/invoices      → PortalInvoicesPage
│
└── /admin                  → AdminLayout (RequireAuth + RequireSuperAdmin)
    ├── /admin                  → AdminDashboardPage (optional)
    ├── /admin/freelancers      → FreelancersPage
    └── /admin/plans            → PlansPage
```

---

## Persona → Route Access

| Persona | After login | Context header | Write access |
|---------|-------------|----------------|--------------|
| Super admin | `/admin` | none | always |
| Workspace owner | `/app` | `X-Freelancer-Id` | yes (unless read_only) |
| Workspace member | `/app` | `X-Freelancer-Id` | yes (unless read_only) |
| Client user | `/portal` | `X-Client-Id` | read-only |

---

## Feature → Page → Component Map

### Auth (`features/Auth/`)

| Page | Components | Hooks |
|------|------------|-------|
| `LoginPage` | `LoginForm`, `AuthLayout` | `useLogin` |
| `ForgotPasswordPage` | `ForgotPasswordForm` | `useForgotPassword` |
| `ResetPasswordPage` | `ResetPasswordForm` | `useResetPassword` |
| — | `RequireAuth`, `PersonaRedirect`, `RequireFreelancer`, `RequireClient`, `RequireSuperAdmin` | `useMe`, `useLogout` |

### Layout (`features/Layout/`)

| Component | Used in |
|-----------|---------|
| `AppLayout` | `/app/*` |
| `PortalLayout` | `/portal/*` |
| `AdminLayout` | `/admin/*` |
| `Sidebar` | all layouts |
| `UserMenu` | all layouts |

### Workspace (`features/Workspace/`)

| Component | Purpose |
|-----------|---------|
| `WorkspaceProvider` | active freelancer context |
| `WorkspaceSwitcher` | multi-workspace dropdown |

### Portal (`features/Portal/`)

| Page | Components | Hooks |
|------|------------|-------|
| `PortalDashboardPage` | `ClientProfileCard` | `usePortalClient` |
| `PortalProjectsPage` | `PortalProjectsTable` | `usePortalProjects` |
| `PortalInvoicesPage` | `PortalInvoicesTable` | `usePortalInvoices` |
| — | `PortalProvider`, `ClientSwitcher` | — |

### Clients (`features/Clients/`)

| Page | Components | Hooks |
|------|------------|-------|
| `ClientsPage` | `ClientsTable`, `ClientFormDialog`, `DeleteClientDialog` | `useClientList`, CRUD |
| `ClientDetailPage` | `ClientHeader`, tabs: `ClientProjectsTab`, `ClientMembersTab` | `useClient` |

### Projects (`features/Projects/`)

| Page | Components | Hooks |
|------|------------|-------|
| `ProjectsPage` | `ProjectsTable`, `ProjectFormDialog` | `useProjectList` |
| `ProjectDetailPage` | tabs: `ProjectTasksTab`, `TimeSummaryCard`, `ProjectInvoicesTab` | `useProject` |

### Tasks (`features/Tasks/`)

| Component | Used in |
|-----------|---------|
| `ProjectTasksTab` | `ProjectDetailPage` |
| `TaskFormDialog` | create/edit task |
| `TaskDetailPage` or Sheet | task + time logs |

### Time Logs (`features/TimeLogs/`)

| Component | Used in |
|-----------|---------|
| `TimeLogForm` | task detail |
| `TimeLogsList` | task detail |
| `TimeSummaryCard` | project detail |

### Invoices (`features/Invoices/`)

| Page | Components | Hooks |
|------|------------|-------|
| `InvoicesPage` | `InvoicesTable`, status filter | `useClientInvoiceList` |
| `InvoiceDetailPage` | `InvoiceItemsTable`, `InvoiceStatusActions`, `AddInvoiceItemDialog`, `RecordPaymentDialog` | detail + mutations |

### Members (`features/Members/`)

| Page | Components | Hooks |
|------|------------|-------|
| `MembersPage` | `MembersTable`, `InviteMemberDialog` | `useMemberList`, `useInviteMember` |

### Settings (`features/Settings/`)

| Page | Hooks |
|------|-------|
| `UserSettingsPage` | `useMeSettings`, `useUpdateMeSettings` |
| `WorkspaceSettingsPage` | `useWorkspaceSettings`, `useUpdateWorkspaceSettings` |

### Subscription (`features/Subscription/`)

| Page | Components | Hooks |
|------|------------|-------|
| `SubscriptionPage` | `PlanStatusCard`, `CheckoutButton`, `CancelPlanDialog` | subscription hooks |

### Admin (`features/Admin/`)

| Page | Components | Hooks |
|------|------------|-------|
| `FreelancersPage` | `FreelancersTable`, `CreateFreelancerDialog`, `ResendInviteButton` | admin freelancer hooks |
| `PlansPage` | `PlansTable`, `PlanFormDialog` | admin plan hooks |

---

## Shared Components (`src/components/`)

| Component | Purpose | Used by |
|-----------|---------|---------|
| `PageHeader` | title, description, action slot | all list/detail pages |
| `EmptyState` | icon, message, CTA | all list pages |
| `ErrorAlert` | API error display | all data pages |
| `LoadingSkeleton` | page/table skeleton | all data pages |
| `CursorPagination` | prev/next cursor nav | all list pages |
| `ConfirmDialog` | destructive action confirm | delete, void, cancel |
| `ReadOnlyBanner` | subscription lapsed warning | AppLayout |
| `DataTable` | sortable table wrapper | list pages |

---

## API → Feature Quick Reference

| API group | Feature folder | Primary pages |
|-----------|----------------|---------------|
| `/login`, `/logout`, `/me` | `Auth` | Login, guards |
| `/me/settings` | `Settings` | UserSettingsPage |
| `/workspace/settings` | `Settings` | WorkspaceSettingsPage |
| `/members` | `Members` | MembersPage |
| `/clients` | `Clients` | ClientsPage, ClientDetailPage |
| `/projects` | `Projects` | ProjectsPage, ProjectDetailPage |
| `/tasks`, `/time-logs` | `Tasks`, `TimeLogs` | ProjectDetailPage tabs |
| `/client-invoices` | `Invoices` | InvoicesPage, InvoiceDetailPage |
| `/portal/*` | `Portal` | Portal pages |
| `/subscription/*` | `Subscription` | SubscriptionPage |
| `/admin/*` | `Admin` | Admin pages |

---

## Component Tree Example — ClientDetailPage

```
ClientDetailPage
├── PageHeader (name, edit, delete actions)
├── ReadOnlyBanner (from layout, if applicable)
├── Tabs
│   ├── Projects → ClientProjectsTab
│   │   ├── DataTable
│   │   ├── EmptyState
│   │   └── ProjectFormDialog
│   └── Members → ClientMembersTab
│       ├── DataTable
│       └── InviteClientMemberDialog
└── ClientFormDialog (edit)
```

## Data Flow Example — Create Client

```
User clicks "Add client"
  → ClientFormDialog opens
  → react-hook-form + zod validates
  → useCreateClient mutation
  → apiRequest POST /clients (X-Freelancer-Id)
  → invalidate clientKeys.lists()
  → toast success, dialog closes
  → ClientsPage refetches
```
