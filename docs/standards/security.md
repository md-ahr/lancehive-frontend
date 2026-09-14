# Security Guidelines

Frontend security for LanceHive — defense in depth with backend as source of truth.

---

## Authentication

| Rule | Implementation |
|------|----------------|
| Token storage | `lib/auth-storage.ts` only — never duplicate |
| Token on requests | `apiRequest()` injects `Authorization` |
| Logout | Clear token + invalidate queries + redirect |
| 401 handling | Global interceptor → `/login` |
| Never log tokens | No console.log of headers or localStorage |

## Context headers

- `X-Freelancer-Id` / `X-Client-Id` from authenticated `/me` only — never user-editable raw input
- Switch workspace/client only via UI backed by membership list from API

## Secrets & config

| ✅ | ❌ |
|----|-----|
| `VITE_API_URL` in `.env` | API keys in source code |
| `.env` in `.gitignore` | Secrets in `VITE_*` vars (bundled to client) |
| `.env.example` without secrets | Committing `.env` |

## Authorization UI

- Hide/disable actions user cannot perform (from `/me` role + permissions)
- **Never rely on UI alone** — backend returns 403; handle gracefully
- Admin routes behind `RequireSuperAdmin`
- Portal is read-only — no mutation buttons

## Input & XSS

- React escapes JSX text by default
- Avoid `dangerouslySetInnerHTML` — if required, sanitize first
- Validate all inputs with zod before API submit
- Do not reflect URL params into HTML without encoding

## Error & data leakage

- User messages via `getUserMessage()` — no stack traces
- Do not render full `ApiError.body` in production UI
- Do not expose internal IDs in user-facing errors unless necessary

## Dependencies

- Run `pnpm audit` before release milestones
- Pin major versions in lockfile

## Read-only workspace

- Disable write UI when `subscription.read_only`
- Still allow subscription routes for owner (API exempt)

## Testing security

- Test: unauthenticated access redirects
- Test: wrong persona cannot reach guarded routes (integration)
- Test: 403 shows permission message, not raw error

Reference: `docs/user-journey-api.md` route group table.
