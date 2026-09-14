# Commit Message Standard

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit. Messages must be clear to non-experts and match the work in the diff.

---

## Format

```
<type>(<scope>): <short summary>

[optional body — explain why, not what]

[optional footer — task ID, breaking changes]
```

| Part | Rules |
|------|-------|
| **type** | Required — see table below |
| **scope** | Optional — feature area (`auth`, `clients`, `invoices`, `deps`, `test`) |
| **summary** | Required — imperative mood, ≤72 chars, no period at end |
| **body** | Optional — wrap at ~72 chars; explain motivation and impact |
| **footer** | Optional — `Task: C-04` or `BREAKING CHANGE: ...` |

---

## Types

| Type | When to use |
|------|-------------|
| `feat` | New user-facing feature or page |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change (oxfmt, whitespace) |
| `refactor` | Code change, no feature/fix |
| `test` | Add or update tests only |
| `chore` | Tooling, deps, config (Vite, Vitest, CI) |
| `perf` | Performance improvement |
| `build` | Build system or bundler |
| `ci` | CI/CD workflows |

---

## Scope examples (LanceHive)

| Scope | Use for |
|-------|---------|
| `auth` | Login, guards, session |
| `clients` | Clients feature |
| `projects` | Projects feature |
| `invoices` | Invoicing |
| `portal` | Client portal |
| `admin` | Admin area |
| `layout` | App shell, sidebar |
| `deps` | package.json / lockfile |
| `test` | Vitest/MSW infra |

Omit scope if change spans many areas: `chore: align agentic workflow docs`.

---

## Task ID linkage

When committing work for a development-plan task, add footer:

```
Task: C-04
```

One commit per task when possible. If a task spans multiple commits, use the same task ID and incremental summaries:

```
feat(clients): add useClientList hook with cursor pagination

Task: C-02
```

---

## Examples

### Feature (page)

```
feat(clients): add ClientsPage with cursor pagination

Implement list, empty, loading, and error states using shared
DataTable and CursorPagination. Includes MSW integration tests.

Task: C-04
```

### Fix

```
fix(auth): redirect to login on 401 from useMe

Clear stale token before redirect so RequireAuth does not loop.

Task: A-09
```

### Tests only

```
test(clients): add ClientsPage integration tests

Cover loading, empty, error, and happy paths with MSW handlers.

Task: C-04
```

### Chore / foundation

```
chore(deps): add TanStack Query, Zustand, and React Router

Task: F-01
```

### Docs

```
docs: add commit message standard to agentic workflow
```

---

## Do

- Write summary in **imperative**: "add", "fix", "update" — not "added" or "adds"
- Focus body on **why** the change matters
- Match the type to the **primary** change (feat over chore if user value shipped)
- Run `git diff` before writing — message must reflect actual changes

## Don't

- `wip`, `fix stuff`, `updates`, `misc`
- Mix unrelated changes in one commit
- Commit `.env`, tokens, or credentials
- Use `feat` for docs-only or test-only commits

---

## Agent workflow (when user asks to commit)

1. Run `git status` and `git diff` (staged + unstaged)
2. Identify primary type, scope, and task ID from branch/context
3. Draft message per format above
4. Stage only relevant files — never secrets
5. Commit via HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
feat(clients): add ClientsPage with cursor pagination

Task: C-04
EOF
)"
```

6. Run `git status` to confirm success

Only commit when the user explicitly asks.

---

## Related

- [definition-of-done.md](./definition-of-done.md) — commit message checked before task marked done (if committing)
- User rule: commit only when requested; follow git safety protocol
