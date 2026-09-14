# Context Request Protocol

> Agents must ask the project owner before guessing when required context is missing.
> Full workflow: [agentic-workflow.md](./agentic-workflow.md) · Rule: `.cursor/rules/ask-for-context.mdc`

## When to ask (stop and ask me)

Ask **before** writing code or making product decisions when any of these apply:

| Situation | Example question |
|-----------|------------------|
| **Task scope unclear** | "Which development-plan task ID should I implement — C-04 or C-05?" |
| **Ambiguous acceptance criteria** | "Done when says 'detail view' — should this be a full page or a Sheet?" |
| **API contract gap** | "The endpoint doc has no error shape for 422 — should I match clients or ask you to update the backend doc?" |
| **Undocumented product behavior** | "Should portal users see draft invoices or only sent ones?" |
| **Design not in repo** | "Do you have a Figma link or reference for this layout?" |
| **Runtime / environment** | "Should I test against your local API at `VITE_API_URL`, or MSW-only for this task?" |
| **Credentials or test data** | "I need a login to verify the flow — can you share test credentials or seed data?" |
| **Irreversible or wide-scope choice** | "This refactor touches 12 features — proceed all at once or only `{Feature}`?" |
| **Conflict between docs and code** | "development-plan says X but `user-journey-api.md` says Y — which is correct?" |

**Rule of thumb:** If a wrong assumption would require rework of more than ~30 minutes, ask first.

## When NOT to ask (explore first)

Do **not** block on the user when you can resolve context yourself:

- Task ID and **Done when** are in the user message or `docs/development-plan.md`
- API shape is in `docs/api/` or `docs/user-journey-api.md`
- Patterns exist in a similar feature under `src/features/`
- Stack, naming, testing, and security rules are in `docs/standards/`
- Sensible defaults are documented (e.g. MSW for unit tests, four UI states for pages)
- A minor implementation detail with no product impact (import order, internal helper name)

**Explore order:** user message → development-plan → API docs → codebase search → similar feature → **then ask** if still blocked.

## How to ask

1. **State what you know** — task ID, files read, what you inferred.
2. **State what is missing** — one sentence, plain English.
3. **Ask specific question(s)** — prefer options over open-ended when possible.
4. **Batch** — combine related questions in one message; do not drip one question per turn.
5. **Propose a default** — "If you don't care, I'll do X because Y."

### Question template

```markdown
## Context needed

**Working on:** {task ID or user request}

**I checked:** {docs/files searched}

**Blocked on:** {what you cannot infer}

**Question:** {specific question}

**Default if no preference:** {your recommendation + reason}
```

### Good vs bad

| Bad | Good |
|-----|------|
| "How should I build this?" | "T-03 Done when says DataTable — reuse `ClientsTable` pattern or add inline columns?" |
| "What's the API?" | "tasks.md shows cursor pagination — confirm page size 20 matches backend default?" |
| Asking about commit format | Read `docs/standards/commit-messages.md` — never ask |
| 5 separate messages | One message with 2–3 numbered questions |

## Context the owner can provide

Keep answers short; links and task IDs are enough.

| Context type | What to send |
|--------------|--------------|
| Task | Plan ID (e.g. `C-04`) or paste **Done when** |
| API | Backend running? Base URL? Known divergence from `docs/api/` |
| Design | Figma URL, screenshot, or "match {existing page}" |
| Product | Business rule in one sentence |
| Test | Test user email/password or "MSW only" |
| Priority | "MVP only" / "full Done when" / "skip tests this pass" |

## Workflow placement

```
0. Context check — ask if blocked (this doc)
1. Discover
2. Scaffold
…
9. Commit (user request only)
```

Agents run step **0** at session start and again whenever new ambiguity appears mid-task.
