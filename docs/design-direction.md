# Design Direction

Visual and UX standards for LanceHive frontend. **North star:** [Stripe Dashboard](https://dashboard.stripe.com) (2024) — calm, financial-grade, data-first B2B SaaS, adapted with LanceHive violet branding.

**Stack:** shadcn/ui · Tailwind v4 · tokens in `src/index.css`

---

## Design principle

> Neutral gray canvas, violet for actions and links, borders not shadows, tables over cards.

Looks like serious business software that freelancers are comfortable sending clients to.

---

## Color

Use CSS variables from `src/index.css` — do not hard-code hex values in components.

### 60-30-10 rule

Follow the standard **60-30-10** color proportion on every screen. Roughly **60%** dominant neutral, **30%** secondary surfaces, **10%** accent — never invert or overload accent.

| Share | Role | Tokens | Apply to |
|-------|------|--------|----------|
| **60%** | Dominant | `background`, `muted`, `foreground` | Page canvas (`bg-muted/30`), main content area, body text, table body |
| **30%** | Secondary | `card`, `sidebar`, `border`, `secondary`, `muted-foreground` | Sidebar, cards, table headers, borders, secondary buttons, metadata text |
| **10%** | Accent | `primary`, `ring` | Primary CTA (one per view), active nav item, links, focus rings, key status badges |

**How to apply:**
- If a page feels “too purple,” accent share is over 10% — remove tint from backgrounds and demote extra primary buttons to `outline` or `ghost`.
- Status colors (`destructive`, semantic badges) count toward accent — use sparingly, one badge per row max.
- Illustrations, empty states, and marketing auth pages still obey 60-30-10; accent stays on the single main action.

### Token map

| Role | Token | Usage |
|------|-------|--------|
| Canvas | `background`, `muted` | Page background (`bg-muted/30` on app shell content area) |
| Surface | `card`, `popover` | Grouped sections, dialogs, dropdowns |
| Primary | `primary` | Primary buttons, active nav, links, focus rings |
| Text | `foreground`, `muted-foreground` | Body vs secondary/metadata |
| Border | `border`, `input` | 1px dividers, table rows, inputs |
| Status | `destructive` + semantic badges | Errors, overdue, cancelled — never tint whole pages |

**Rules:**
- Violet (`primary`) only for interactive emphasis — not decorative backgrounds.
- One `default` primary button per page header or dialog footer; additional actions use `outline` or `ghost`.
- Light mode is the default; dark mode uses the same 60-30-10 hierarchy with `.dark` tokens.
- Respect `prefers-color-scheme` via system theme when theme toggle is implemented.

---

## Typography

| Use | Font | Class / token |
|-----|------|----------------|
| UI body, tables, forms | Inter Variable | `font-sans` (default) |
| Page titles, section headers | Montserrat Variable | `font-heading` |
| Money, hours, IDs | Inter | `tabular-nums` |

**Scale:**
- Page title: `text-2xl font-heading font-semibold`
- Section title: `text-lg font-heading font-medium`
- Body: `text-sm` (14px effective)
- Metadata: `text-sm text-muted-foreground`
- Table header: `text-xs font-medium text-muted-foreground uppercase tracking-wide`

One clear H1 per page. Do not use Montserrat for table cells or form labels.

---

## Layout

### App (`/app/*`, `/admin/*`)

```
┌─────────────┬──────────────────────────────────┐
│  Sidebar    │  Top bar (workspace, user menu)  │
│  ~240px     ├──────────────────────────────────┤
│  fixed      │  Page header (title + actions)   │
│             │  Content (tables, filters, forms) │
└─────────────┴──────────────────────────────────┘
```

- **Sidebar:** shadcn `Sidebar` — light `sidebar` tokens, collapsible on mobile.
- **Content area:** `bg-muted/30`, padding `p-6` (desktop), `p-4` (mobile).
- **Page header:** title left, primary action right (`flex items-center justify-between`).
- **Max width:** full width for tables; forms max `max-w-lg` inside dialogs.

### Portal (`/portal/*`)

Same tokens and components. Differences only:

- **No sidebar** — horizontal top nav with client context.
- **More whitespace** — `p-8` content padding, single-column layout.
- **Read-only** — no create/edit/delete UI (security rule).

### Auth (`/login`, etc.)

Centered card on `bg-muted/30`, logo + form, no sidebar.

---

## Surfaces & depth

| Pattern | When |
|---------|------|
| Flat table on canvas | List pages (clients, projects, time logs) |
| `border rounded-lg bg-card` | Grouped detail sections, settings panels |
| `shadow-sm` | Dialogs, popovers, dropdowns only |
| No shadow | List rows, sidebar, page background |

**Radius:** `rounded-lg` (`--radius: 0.625rem`) for cards, inputs, buttons. Badges may use `rounded-md`. No pill buttons except badges.

---

## Data display

**Tables are the primary list pattern** — not card grids.

| Element | Pattern |
|---------|---------|
| Row hover | `hover:bg-muted/50` |
| Numbers | Right-aligned, `tabular-nums` |
| Status | Small `Badge` — `secondary` default, semantic variants for paid/overdue/active |
| Row actions | `DropdownMenu` with icon trigger — not a row of buttons |
| Empty state | Shared `EmptyState` or muted text + primary CTA |
| Loading | `Skeleton` rows matching table layout |
| Pagination | Below table, cursor-based per API |

Filters sit in a toolbar above the table: `Input` search, `Select` filters, primary action top-right.

---

## Actions & forms

| Action type | Component |
|-------------|-----------|
| Primary CTA | `Button` variant `default` |
| Secondary | `Button` variant `outline` or `ghost` |
| Destructive | `Button` variant `destructive` inside `AlertDialog` only |
| Create / edit | `Dialog` or `Sheet` + `Form` — not full-page wizards for MVP |
| Delete confirm | `AlertDialog` |
| Feedback | `sonner` toast |

Form fields: shadcn `Form` + `Input`, `Select`, `Textarea`, `Checkbox`, `Switch`. Labels above fields. Validation errors inline per field (422 mapping).

---

## Motion

- Use shadcn/Radix default transitions for dialogs, sheets, dropdowns.
- `Skeleton` for loading states.
- No decorative animation, parallax, or page transitions.

---

## shadcn components (standard set)

Install via CLI when needed; do not edit `components/ui/` source.

**Shell:** `Sidebar`, `Breadcrumb`, `Separator`  
**Data:** `Table`, `DataTable` (shared wrapper), `Pagination`, `Badge`  
**Forms:** `Dialog`, `Sheet`, `Form`, `Input`, `Select`, `Textarea`, `Checkbox`, `Switch`, `Label`  
**Feedback:** `Alert`, `AlertDialog`, `Skeleton`, sonner `Toaster`  
**Nav:** `DropdownMenu`, `Tabs`, `Avatar`

Extract repeated patterns into `src/components/` (`PageHeader`, `EmptyState`, `DataTable`, `ConfirmDialog`).

---

## Responsive

- **Mobile-first** — usable at 375px.
- Sidebar collapses to sheet/drawer on small screens.
- Tables: horizontal scroll wrapper `overflow-x-auto` before hiding columns.
- Desktop comfort target: 1280px+.

---

## Anti-patterns

Do **not**:

- Marketing-style hero blocks inside `/app/*`
- Card grids for tabular entity lists
- Heavy gradients, glassmorphism, or neon accents
- Custom colors outside design tokens
- Full-page forms for simple CRUD (use dialogs)
- Different visual language for portal vs app (density only differs)
- Raw HTML form controls — always shadcn primitives

---

## Related docs

| Doc | Topic |
|-----|--------|
| [component-composition.mdc](../.cursor/rules/component-composition.mdc) | Component map |
| [build-page-workflow.mdc](../.cursor/rules/build-page-workflow.mdc) | Build steps |
| [definition-of-done.md](./standards/definition-of-done.md) | Four UI states |
| [security.md](./standards/security.md) | Portal read-only |
