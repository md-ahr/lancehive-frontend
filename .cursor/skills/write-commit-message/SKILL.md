---
name: write-commit-message
description: Generates Conventional Commits messages for LanceHive frontend from git diff and development-plan task IDs. Use when the user asks to commit, write a commit message, or finish a task with a git commit.
---

# Write Commit Message

**Only run when the user explicitly asks to commit.**

## Steps

1. Run in parallel: `git status`, `git diff`, `git log -1 --format=%s` (style reference)
2. Read `docs/standards/commit-messages.md`
3. Identify:
   - **type** — primary change (feat, fix, test, docs, chore, …)
   - **scope** — feature area from changed paths
   - **task ID** — from conversation or branch (e.g. `C-04`)
4. Draft summary (imperative, ≤72 chars) + optional body (why)
5. Stage relevant files only — never `.env` or secrets
6. Commit with HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
feat(clients): add ClientsPage with cursor pagination

Implement four UI states and integration tests with MSW.

Task: C-04
EOF
)"
```

7. Run `git status` to verify

## Type quick pick

| Diff shows | Type |
|------------|------|
| New page/feature | `feat` |
| Bug fix | `fix` |
| `*.test.*` only | `test` |
| `docs/**` only | `docs` |
| `package.json`, config | `chore` or `build` |
| Refactor, no behavior change | `refactor` |

## Don't

- Commit without user request
- Use vague messages (`update`, `fix stuff`, `wip`)
- `git commit --amend` unless user rule allows
- Skip reading the diff
