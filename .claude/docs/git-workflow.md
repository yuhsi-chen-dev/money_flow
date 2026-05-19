# Git Workflow & Commit Granularity

> Consult when: drafting commits, splitting work, or deciding "is this one commit or several?"

## Strategy
- **Atomic commits** — one logical change per commit, every time
- **Commit after each working unit** — not at end of day
- **Always run `git diff --staged` before committing** — review what you're about to commit
- **Never commit broken, WIP, or half-finished code**

## Conventional Commit Format
```
<type>(<scope>): <short description in English or Chinese>
```

**Types:**
| Type | When to use |
|---|---|
| `feat` | New feature, page, or component |
| `fix` | Bug fix or incorrect behavior |
| `refactor` | Restructure without changing behavior |
| `style` | CSS, Tailwind, visual only — no logic |
| `docs` | CLAUDE.md, README, code comments |
| `chore` | Config, dependencies, tooling |
| `test` | Adding or updating tests |

**Scopes:**
`auth` · `dashboard` · `month` · `history` · `settings` · `api` · `db` · `ui` · `finance` · `hooks` · `types` · `layout`

## Commit Message Examples
```bash
feat(auth): build Google OAuth login page with Apple design
feat(db): add initial Supabase schema migration with RLS policies
feat(ui): create Button, Card, Input, Badge, Toast components
feat(layout): build Navbar with dark mode and active route highlight
feat(layout): add PageWrapper with max-w-5xl and nav offset
feat(dashboard): add SavingHero with color-coded 額外儲蓄
feat(dashboard): add FormulaBreakdown cards grid
feat(dashboard): make dashboard fully responsive (RWD)
feat(api): implement settings GET and PUT endpoints
feat(settings): build settings form with fixed expenses CRUD
feat(api): implement monthly-records PATCH endpoint
feat(month): build variable expense form with live preview
feat(month): add optional category breakdown with add/remove
feat(history): integrate recharts BarChart for monthly trend
feat(history): add yearly summary stats and month data table
fix(finance): handle null record correctly in calculateMonth
refactor(hooks): extract useMonthlyRecord from dashboard page
style(ui): refine Button hover states and transition timing
docs(CLAUDE.md): update Current Task — settings page complete
chore: configure pnpm scripts for supabase type generation
test(finance): add unit tests for calculateMonth edge cases
```

## Commit Granularity Per Feature

| Feature | Commits | How to split |
|---|---|---|
| Login page | 2 | Page UI → OAuth wiring + redirect |
| App shell + Navbar | 2 | Structure + layout → styling + active states |
| Settings page | 4 | Form UI → fixed expense CRUD → API route → error handling |
| Dashboard | 4 | Hero component → formula cards → month selector → RWD |
| Month update | 4 | Form + inputs → category list → live preview → save + validation |
| History | 3 | Chart integration → summary stats → data table |
| Any single API route | 1–2 | Implementation → error handling (if complex) |
| UI primitives | 1–2 | Core components → variants and edge cases |

## Never Commit
```
.env.local              — contains Supabase secrets
node_modules/           — already in .gitignore
.next/                  — build output
.DS_Store               — macOS metadata
*.log                   — log files
supabase/.temp/         — local Supabase temp files
.claude/settings.local.json — local Claude Code permission cache
```

## Vibe Coding Session Template

```
── START OF SESSION ────────────────────────────────
1. Update ## Current Task in CLAUDE.md
2. Tell Claude: "Read CLAUDE.md and confirm the current task"

── DURING SESSION ──────────────────────────────────
3. "Build [specific feature from Current Task]"
4. Review the output carefully
5. "Run git diff --staged and commit: feat(scope): description"

── END OF SESSION ──────────────────────────────────
6. Update ## Current Task: check off done items, add next ones
7. "Commit CLAUDE.md update: docs: update current task status"
```
