# MoneyFlow — Personal Finance Tracker
> 儲蓄 = 收入 - 固定支出 - 浮動支出

A minimalist personal finance tracker built around one formula and one goal:  
**Know exactly how much extra you saved this month.**

---

## Current Task

**Status:** 🚀 Project initialization — nothing built yet

**Building now:**
- [ ] Scaffold Next.js 14 project with TypeScript + Tailwind + pnpm
- [ ] Configure ESLint, Prettier, path aliases (`@/`)
- [ ] Set up Supabase project + run schema migrations
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Build login page (Apple-style, Google OAuth)
- [ ] Build app shell: Navbar + layout with dark mode CSS variables

**Known blockers:**
- None yet

**Session context:**
- Taiwan timezone (Asia/Taipei), currency NTD
- Dark mode first, light mode secondary
- pnpm as package manager throughout
- ⚠️ Update this section at the start of every new coding session

---

## Project Philosophy

This is **NOT** a generic expense tracker. It is a single-owner financial clarity tool.

- 收入 is fixed monthly salary — rarely changes, occasionally has a one-off bonus
- 固定支出 is fully pre-configured — set once, rarely edited
- 浮動支出 is entered **once per month at month-end** — total required, category breakdown optional
- ETF 定期定額 = NT$24,000/month — always invested, non-negotiable
- 額外儲蓄 = what's left after ETF — the **one number that matters most**

**Design constraint:** Every feature must serve the formula. Reject scope creep.

---

## Core Formula

```
當月總儲蓄  =  收入  +  bonus  -  固定支出  -  浮動支出

額外儲蓄    =  當月總儲蓄  -  24,000 (ETF)
```

| Term | Description | Frequency |
|---|---|---|
| 收入 | Fixed monthly salary | Pre-configured in settings |
| bonus | One-off extra income | Optional, entered per month |
| 固定支出 | Fixed recurring expenses | Pre-configured list in settings |
| 浮動支出 | Variable spending total | Entered once at month-end |
| ETF | 定期定額 investment | Always NT$24,000 |
| **額外儲蓄** | **The key number** | **Auto-calculated** |

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components by default |
| Language | TypeScript 5 (strict mode) | No `any`, no `@ts-ignore` |
| Styling | Tailwind CSS v3 + CSS Variables | All colors via CSS variables |
| Database | Supabase (PostgreSQL) | Free tier is sufficient |
| Auth | Supabase Auth — Google OAuth | No email/password needed |
| Deployment | Vercel | Auto-deploy on push to main |
| Package Manager | pnpm | Faster, strict dependency graph |
| Linting | ESLint + Prettier | Auto-fix on save |
| Testing | Jest + React Testing Library | Unit tests for lib/finance.ts |
| Charts | recharts | History page only |

---

## Design System — Apple-Inspired Minimalism

### Philosophy
- **Clean, spacious, confident** — think apple.com, not a SaaS dashboard
- Large typography. Generous whitespace. Razor-sharp contrast.
- Dark mode is primary. Light mode is secondary.
- Every pixel intentional. Zero decorative flourishes.
- Micro-interactions: subtle and purposeful, never flashy.

### Typography
```css
--font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
--font-body:    'SF Pro Text',    -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
--font-mono:    'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
```
Font stack always ends with `-apple-system, BlinkMacSystemFont, sans-serif`.  
Never use Inter, Roboto, or Arial.

### Color Palette — Full CSS Variables

Define entirely in `app/globals.css`:

```css
:root {
  /* Backgrounds */
  --color-bg:             #000000;
  --color-bg-elevated:    #111111;
  --color-bg-card:        #1c1c1e;
  --color-bg-hover:       #2c2c2e;

  /* Borders */
  --color-border:         rgba(255, 255, 255, 0.08);
  --color-border-strong:  rgba(255, 255, 255, 0.16);

  /* Text */
  --color-text-primary:   #f5f5f7;
  --color-text-secondary: #a1a1a6;
  --color-text-tertiary:  #6e6e73;
  --color-text-disabled:  #3a3a3c;

  /* Accents */
  --color-accent:         #2997ff;
  --color-accent-hover:   #0077ed;
  --color-success:        #30d158;
  --color-success-muted:  rgba(48, 209, 88, 0.12);
  --color-warning:        #ffd60a;
  --color-danger:         #ff453a;
  --color-danger-muted:   rgba(255, 69, 58, 0.12);
}

/* Light mode overrides */
@media (prefers-color-scheme: light) {
  :root {
    --color-bg:             #ffffff;
    --color-bg-elevated:    #f5f5f7;
    --color-bg-card:        #ffffff;
    --color-bg-hover:       #e8e8ed;
    --color-border:         rgba(0, 0, 0, 0.08);
    --color-border-strong:  rgba(0, 0, 0, 0.16);
    --color-text-primary:   #1d1d1f;
    --color-text-secondary: #6e6e73;
    --color-text-tertiary:  #aeaeb2;
    --color-text-disabled:  #d1d1d6;
    --color-accent:         #0071e3;
    --color-accent-hover:   #0077ed;
    --color-success:        #1c7c2e;
    --color-success-muted:  rgba(28, 124, 46, 0.08);
    --color-warning:        #b38600;
    --color-danger:         #d70015;
    --color-danger-muted:   rgba(215, 0, 21, 0.08);
  }
}
```

### Spacing & Layout
- Page horizontal padding: `px-4 md:px-8`
- Section vertical padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Grid gaps: `gap-4`, `gap-6`, `gap-8`
- **Max content width: `max-w-5xl mx-auto`**
- **Mobile-first RWD**: `sm:640px` · `md:768px` · `lg:1024px`

### Component Patterns

**Cards:**
```
rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6
```

**Primary Button:**
```
bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
text-white rounded-full px-6 py-2.5 font-medium text-sm
transition-all duration-200 ease-in-out
```

**Secondary Button:**
```
bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)]
text-[var(--color-text-primary)] rounded-full px-6 py-2.5 font-medium text-sm
transition-all duration-200 ease-in-out
```

**Hero Number (額外儲蓄):**
```
text-5xl md:text-7xl font-bold tabular-nums tracking-tight
— positive: text-[var(--color-success)]
— negative: text-[var(--color-danger)]
```

**Text Input:**
```
w-full rounded-xl border border-[var(--color-border)]
bg-[var(--color-bg-elevated)] px-4 py-3 text-sm
text-[var(--color-text-primary)]
placeholder:text-[var(--color-text-tertiary)]
focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
transition-all duration-200
```

**Navbar:**
```
fixed top-0 inset-x-0 z-50
bg-[var(--color-bg)]/80 backdrop-blur-xl
border-b border-[var(--color-border)]
h-14 flex items-center justify-between px-4 md:px-8
```

**Badge:**
```
— "已更新": bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-full px-3 py-1 text-xs font-medium
— "預估中": bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] rounded-full px-3 py-1 text-xs font-medium
```

### Rules
- No drop shadows — use border + background contrast
- Hover: `hover:scale-[1.01]` or `hover:bg-[var(--color-bg-hover)]` — never color explosion
- All transitions: `transition-all duration-200 ease-in-out`
- Grid for dashboard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Flexbox for components: `flex items-center gap-3`

---

## Project Structure

```
moneyflow/
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Auth route group — no Navbar
│   │   └── login/
│   │       └── page.tsx              # Google OAuth login page
│   ├── (app)/                        # Protected route group
│   │   ├── layout.tsx                # App shell: Navbar + session guard
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 當月總覽 — main page
│   │   ├── month/
│   │   │   └── [ym]/
│   │   │       └── page.tsx          # 月底更新 — param format: YYYY-MM
│   │   ├── history/
│   │   │   └── page.tsx              # 歷史趨勢圖
│   │   └── settings/
│   │       └── page.tsx              # 設定固定收支
│   ├── api/
│   │   ├── monthly-records/
│   │   │   ├── route.ts              # GET (list all), POST (create)
│   │   │   └── [ym]/
│   │   │       └── route.ts          # GET, PATCH, DELETE by YYYY-MM
│   │   └── settings/
│   │       └── route.ts              # GET, PUT user settings
│   ├── layout.tsx                    # Root layout — fonts, metadata, theme
│   └── globals.css                   # CSS variables + Tailwind base styles
│
├── components/
│   ├── ui/                           # Primitive reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx                 # Status: "已更新" / "預估中"
│   │   ├── Modal.tsx
│   │   └── Toast.tsx                 # Success / error notifications
│   ├── layout/
│   │   ├── Navbar.tsx                # Fixed top nav with links + active state
│   │   └── PageWrapper.tsx           # max-w-5xl, padding, pt-14 for nav offset
│   ├── dashboard/
│   │   ├── SavingHero.tsx            # Hero: 額外儲蓄 large number
│   │   ├── FormulaBreakdown.tsx      # Cards grid showing all formula components
│   │   └── MonthSelector.tsx         # Prev/next month navigation
│   ├── month/
│   │   ├── VariableExpenseForm.tsx   # Main 浮動支出 input form
│   │   ├── CategoryList.tsx          # Optional category breakdown items
│   │   └── LivePreview.tsx           # Real-time formula preview panel
│   └── history/
│       ├── SavingsTrendChart.tsx     # recharts BarChart — 額外儲蓄 by month
│       ├── YearlySummary.tsx         # Stats: total, avg, best, worst month
│       └── MonthTable.tsx            # Tabular data for all months
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient() for Client Components
│   │   ├── server.ts                 # createServerClient() for Server Components + API routes
│   │   └── types.ts                  # Generated via `pnpm supabase:types`
│   ├── finance.ts                    # Pure calculation functions — no side effects
│   ├── constants.ts                  # ETF_AMOUNT, DEFAULT_CATEGORIES
│   └── utils.ts                      # cn(), formatCurrency(), formatYM(), getCurrentYM(), isValidYM()
│
├── hooks/
│   ├── useCurrentMonth.ts            # Returns current YYYY-MM string
│   ├── useMonthlyRecord.ts           # Fetch + mutate a single monthly record
│   ├── useMonthlyHistory.ts          # Fetch all records for history page
│   └── useSettings.ts               # Fetch + mutate user settings
│
├── types/
│   └── index.ts                      # All shared TypeScript interfaces
│
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql   # Full schema — DO NOT edit
│
├── __tests__/
│   └── finance.test.ts               # Unit tests for lib/finance.ts
│
├── .env.local                        # Secrets — NEVER commit
├── .env.example                      # Template — commit this
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── CLAUDE.md                         # This file
└── package.json
```

---

## Database Schema

File: `supabase/migrations/0001_initial_schema.sql`  
**Never edit migration files directly. Use `pnpm supabase:migration:new <name>` to add changes.**

```sql
-- ============================================================
-- user_settings: one row per user
-- ============================================================
CREATE TABLE user_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  monthly_income  NUMERIC(12, 0) NOT NULL DEFAULT 0,
  etf_amount      NUMERIC(12, 0) NOT NULL DEFAULT 24000,
  fixed_expenses  JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- fixed_expenses shape:
  -- [{ "id": "uuid", "name": "房租", "amount": 18000 }]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- monthly_records: one row per user per month
-- ============================================================
CREATE TABLE monthly_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year_month      CHAR(7) NOT NULL,
  -- year_month format: "YYYY-MM" e.g. "2025-01"
  bonus           NUMERIC(12, 0) NOT NULL DEFAULT 0,
  variable_total  NUMERIC(12, 0) NOT NULL DEFAULT 0,
  variable_items  JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- variable_items shape:
  -- [{ "id": "uuid", "category": "食費", "amount": 8000, "note": "optional" }]
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, year_month)
);

-- ============================================================
-- Row Level Security — users can only touch their own data
-- ============================================================
ALTER TABLE user_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings: own rows only"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monthly_records: own rows only"
  ON monthly_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Auto-update updated_at on every UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_monthly_records_updated_at
  BEFORE UPDATE ON monthly_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## TypeScript Types

```typescript
// types/index.ts

// ── Settings ─────────────────────────────────────────────────
export interface FixedExpenseItem {
  id: string        // client-generated UUID
  name: string      // e.g. "房租", "Netflix", "健身房"
  amount: number    // integer NTD
}

export interface UserSettings {
  id: string
  userId: string
  monthlyIncome: number           // integer NTD
  etfAmount: number               // default 24000
  fixedExpenses: FixedExpenseItem[]
  createdAt: string
  updatedAt: string
}

// ── Monthly Records ──────────────────────────────────────────
export interface VariableItem {
  id: string        // client-generated UUID
  category: string  // e.g. "食費", "交通", "娛樂", "其他"
  amount: number    // integer NTD
  note?: string     // optional free text
}

export interface MonthlyRecord {
  id: string
  userId: string
  yearMonth: string               // "YYYY-MM"
  bonus: number                   // default 0
  variableTotal: number           // required integer
  variableItems: VariableItem[]   // optional breakdown; sum should equal variableTotal
  note?: string
  createdAt: string
  updatedAt: string
}

// ── Finance Calculation Result ───────────────────────────────
export interface MonthCalculation {
  totalIncome: number             // monthlyIncome + bonus
  totalFixed: number              // sum of all fixedExpenses amounts
  variableTotal: number           // from record (or 0 if projection)
  totalSavings: number            // totalIncome - totalFixed - variableTotal
  etfAmount: number               // from settings
  extraSavings: number            // totalSavings - etfAmount ← THE KEY NUMBER
  isProjection: boolean           // true = no record exists yet, using defaults
}

// ── API Response Shape ───────────────────────────────────────
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string } }

// ── Internal Result Pattern ──────────────────────────────────
export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: Error }
```

---

## Core Finance Logic

**All calculations live exclusively in `lib/finance.ts` as pure functions.**  
Never calculate inline in components, hooks, pages, or API routes. Always import from here.

```typescript
// lib/finance.ts
import type { UserSettings, MonthlyRecord, MonthCalculation } from '@/types'

export function calculateMonth(
  settings: UserSettings,
  record: MonthlyRecord | null
): MonthCalculation {
  const bonus        = record?.bonus ?? 0
  const variableTotal = record?.variableTotal ?? 0

  const totalIncome  = settings.monthlyIncome + bonus
  const totalFixed   = settings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalSavings = totalIncome - totalFixed - variableTotal
  const extraSavings = totalSavings - settings.etfAmount

  return {
    totalIncome,
    totalFixed,
    variableTotal,
    totalSavings,
    etfAmount: settings.etfAmount,
    extraSavings,
    isProjection: record === null,
  }
}

export function getTotalFixed(settings: UserSettings): number {
  return settings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
}

export function getSavingsColor(amount: number): 'success' | 'danger' {
  return amount >= 0 ? 'success' : 'danger'
}
```

---

## Constants

```typescript
// lib/constants.ts

export const ETF_AMOUNT = 24000 as const

export const DEFAULT_CATEGORIES = [
  '食費',
  '交通',
  '娛樂',
  '購物',
  '醫療',
  '其他',
] as const

export type DefaultCategory = typeof DEFAULT_CATEGORIES[number]
```

---

## Utility Functions

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format NTD: 24000 → "NT$24,000"
export function formatCurrency(amount: number): string {
  return `NT$${amount.toLocaleString('zh-TW')}`
}

// Format YYYY-MM for display: "2025-01" → "2025年1月"
export function formatYM(ym: string): string {
  const [year, month] = ym.split('-')
  return `${year}年${parseInt(month)}月`
}

// Get current YYYY-MM
export function getCurrentYM(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// Validate YYYY-MM format
export function isValidYM(ym: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym)
}
```

---

## API Conventions

### Response Shape (always consistent)
```typescript
// Success
{ data: T, error: null }

// Error
{ data: null, error: { message: string, code?: string } }
```

### Auth Guard (required at top of every API route)
```typescript
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabase = createServerClient()
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return NextResponse.json(
    { data: null, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
    { status: 401 }
  )
}
const userId = session.user.id  // use this for all DB queries
```

### Route Naming
```
GET  /api/settings              → fetch user settings
PUT  /api/settings              → update user settings

GET  /api/monthly-records       → list all records (for history)
POST /api/monthly-records       → create new record

GET    /api/monthly-records/[ym]  → get single record
PATCH  /api/monthly-records/[ym]  → update record
DELETE /api/monthly-records/[ym]  → delete record
```

---

## Coding Conventions

### TypeScript
- Strict mode always — `"strict": true` in tsconfig.json
- No `any` — use `unknown` if type is truly unknown, then narrow it
- No `@ts-ignore` or `@ts-expect-error`
- Props interface at top of each component file: `interface Props { ... }`
- Named exports for all components, default export for all pages

### Monetary Values
- **Always integers** — NTD has no decimal places
- Use `parseInt()` or `Math.round()`, never `parseFloat()` for money
- DB column is `NUMERIC(12, 0)` — no float ever stored
- Always display with `formatCurrency()` — never raw number in UI

### Components
- One component per file; filename matches export name
- Use `cn()` from `lib/utils.ts` for all conditional class merging
- No inline `style={{}}` except for CSS variable dynamic values
- All theme colors via CSS variables: `text-[var(--color-text-primary)]`

### Data Fetching
- Server Components: fetch directly via `createServerClient()` — no hooks needed
- Client Components: always use custom hooks from `/hooks/`
- Never call `fetch()` or Supabase directly inside a Client Component body
- Never use `useEffect` for data fetching — wrap in a custom hook

### Error Handling
- All async utility functions return `Result<T>`
- API routes always catch and return structured error shape
- UI always shows errors via Toast — never `alert()`, never silent failure

### Imports Order
1. External libraries (`react`, `next/...`, `recharts`)
2. Internal lib/utils (`@/lib/...`)
3. Internal hooks (`@/hooks/...`)
4. Internal components (`@/components/...`)
5. Types (`@/types`)

---

## Environment Variables

```bash
# .env.local — NEVER commit this file
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server-only — never use in client code
```

```bash
# .env.example — commit this as documentation
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Rule:** `SUPABASE_SERVICE_ROLE_KEY` is only usable in `app/api/**` routes.  
Any file in `app/(auth)/` or client components can only access `NEXT_PUBLIC_*` vars.

---

## Commands

```bash
# Development
pnpm dev                       # Start dev server at http://localhost:3000
pnpm build                     # Production build
pnpm start                     # Start production server locally

# Code quality
pnpm lint                      # ESLint check
pnpm lint:fix                  # Auto-fix lint errors
pnpm format                    # Prettier format all files
pnpm type-check                # tsc --noEmit — TypeScript check without build

# Testing
pnpm test                      # Run all Jest tests
pnpm test:watch                # Jest watch mode
pnpm test:coverage             # Jest with coverage report

# Supabase
pnpm supabase:start            # Start local Supabase (requires Docker)
pnpm supabase:stop             # Stop local Supabase
pnpm supabase:migration:new    # Create new SQL migration file
pnpm supabase:types            # Regenerate TypeScript types from live DB schema
```

---

## Git Workflow & Commit Granularity

### Strategy
- **Atomic commits** — one logical change per commit, every time
- **Commit after each working unit** — not at end of day
- **Always run `git diff --staged` before committing** — review what you're about to commit
- **Never commit broken, WIP, or half-finished code**

### Conventional Commit Format
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

### Commit Message Examples
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

### Commit Granularity Per Feature

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

### Never Commit
```
.env.local              — contains Supabase secrets
node_modules/           — already in .gitignore
.next/                  — build output
.DS_Store               — macOS metadata
*.log                   — log files
supabase/.temp/         — local Supabase temp files
```

### Vibe Coding Session Template

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

---

## Pages Spec

### `/login` — 登入
- Full-page centered layout, **no Navbar**
- App name "MoneyFlow" in large display font (`text-4xl font-bold`)
- Tagline: `清楚知道這個月多存了多少` — single line below name
- Single CTA: "使用 Google 登入" — full-width on mobile, auto-width on desktop
- Apple aesthetic: black background, pure white text, maximum whitespace
- On auth success → redirect to `/dashboard`
- If already authenticated → redirect immediately to `/dashboard`

### `/dashboard` — 當月總覽
- Auto-detects current month via `getCurrentYM()`
- **Guard:** If no `user_settings` → redirect to `/settings` with info banner "請先完成設定"
- **Hero section:**
  - Label: "本月額外儲蓄" + badge ("已更新" or "預估中")
  - Number: `text-6xl md:text-8xl font-bold tabular-nums`
  - Color: `--color-success` if ≥ 0, `--color-danger` if < 0
- **Formula cards grid** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`):
  1. 收入 — `monthlyIncome` + bonus line if `bonus > 0`
  2. 固定支出 — `totalFixed` with expandable list on hover/click
  3. 浮動支出 — `variableTotal` or "尚未輸入" if projection
  4. 總儲蓄 — `totalSavings`
  5. ETF 定期定額 — `etfAmount`, always `--color-success`
  6. 額外儲蓄 — `extraSavings`, color-coded, larger than other cards
- **CTA:** "更新本月浮動支出" primary button → `/month/YYYY-MM`
- **Month selector:** ← prev month / current month label / next month →

### `/month/[ym]` — 月底更新
- Validate `ym` with `isValidYM()` — 404 if invalid format
- Header: `更新 {formatYM(ym)}` with back arrow → `/dashboard`
- **浮動支出 total** — required number input, autofocus on mount
- **Bonus** — optional, collapsed by default behind "＋ 新增獎金" toggle
- **Category breakdown** — optional, behind "＋ 新增分類明細" toggle:
  - Add item: select from `DEFAULT_CATEGORIES` or type custom name + amount
  - Show running total vs. entered total — warning if mismatch
  - Remove items with × button
- **Note** — optional textarea, max 200 chars
- **Live preview panel** — sticky on desktop right column, below form on mobile:
  - All formula values update as user types (no submit needed)
  - 額外儲蓄 preview in large colored text
- **Save button** → PATCH `/api/monthly-records/[ym]`
- On success → Toast "已儲存 ✓" then redirect to `/dashboard`
- Allow editing past months — no lock or restriction

### `/history` — 歷史趨勢
- Page title: "歷史趨勢"
- **Year selector** — defaults to current year, navigable
- **recharts BarChart:**
  - X-axis: Jan–Dec (show all 12 months, empty = 0 height)
  - Y-axis: NT$ amount (formatted with `formatCurrency`)
  - Bar: `--color-success` if extraSavings ≥ 0, `--color-danger` if < 0
  - Tooltip: show all MonthCalculation values on hover
  - Empty months: 0 height bar, muted color
- **Yearly summary cards** (`grid-cols-2 md:grid-cols-4`):
  1. 年度額外儲蓄合計
  2. 月平均額外儲蓄
  3. 最佳月份 (max extraSavings)
  4. 最差月份 (min extraSavings)
- **Month table** (sorted newest first):
  - Columns: 月份 / 收入 / 固定支出 / 浮動支出 / 總儲蓄 / ETF / 額外儲蓄 / 操作
  - "編輯" link per row → `/month/[ym]`
  - Empty state message if no records

### `/settings` — 設定
- Page title: "設定"
- **月固定收入** — required number input
- **ETF 定期定額** — number input, default 24000, label: "每月固定投資金額"
- **固定支出清單:**
  - List of items: each row has name input + amount input + delete button
  - Inline editing (no separate modal)
  - "＋ 新增固定支出" button appends a new empty row
  - Running total shown below: "固定支出合計：NT$XX,XXX"
- **Preview** — shows projected 額外儲蓄 assuming no 浮動支出 and no bonus
- **儲存** → PUT `/api/settings`
- On success → Toast "設定已儲存 ✓"

---

## Edge Cases

| Situation | Expected Behavior |
|---|---|
| First login, no settings | Redirect to `/settings` with info banner |
| Dashboard with no record for current month | Show projection with "預估中" badge, variableTotal = 0 |
| Months with no record in history | Empty bar in chart (height 0), "—" in table cells |
| Negative 額外儲蓄 | Red color, no error — perfectly valid |
| bonus = 0 | Don't render bonus line in formula cards |
| variableItems sum ≠ variableTotal | Show inline warning; save anyway (variableTotal is authoritative) |
| Navigate to a future month | Allowed — useful for planning |
| ETF amount > totalSavings | extraSavings is negative, shown in red |
| Edit a past month | Allowed — no restrictions on past dates |
| Delete a monthly record | Allowed via DELETE API — confirm before action |

---

## DO NOT

- ❌ Never use `any` in TypeScript — use proper types or `unknown`
- ❌ Never calculate finance numbers outside `lib/finance.ts`
- ❌ Never edit files in `supabase/migrations/` — create a new migration instead
- ❌ Never commit `.env.local` — it contains live Supabase credentials
- ❌ Never import or reference `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- ❌ Never use `useEffect` for data fetching — always use a custom hook
- ❌ Never hardcode hex colors in Tailwind classes — always use CSS variables
- ❌ Never use `alert()` — use the Toast component for all user feedback
- ❌ Never store currency as float — integers only, NTD has no cents
- ❌ Never add features outside this spec without first updating CLAUDE.md
- ❌ Never skip the auth guard in any API route
- ❌ Never commit WIP or broken code — every commit should be working state

---

## Current Status

- [ ] Project scaffold: Next.js 14, TypeScript, Tailwind, pnpm
- [ ] ESLint + Prettier configured
- [ ] Path aliases configured (`@/`)
- [ ] Supabase project created
- [ ] Schema migration run (0001_initial_schema.sql)
- [ ] Google OAuth configured in Supabase Auth settings
- [ ] `.env.local` populated with Supabase credentials
- [ ] Login page built and Google OAuth working
- [ ] App shell: Navbar + layout + dark mode CSS variables
- [ ] UI primitives: Button, Card, Input, Badge, Toast
- [ ] Settings page + GET/PUT API route working
- [ ] Dashboard page working (projection + real record state)
- [ ] Month update page working with live preview
- [ ] History page with recharts chart + summary stats
- [ ] Deployed to Vercel
- [ ] Custom domain (optional)

---

## Decisions Log

| Decision | Chosen | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | Server components, built-in routing, Vercel-native |
| Auth | Supabase Google OAuth | Single user — no need for email/password complexity |
| Database | Supabase PostgreSQL | Auth + DB + RLS in one platform, free tier is sufficient |
| Hosting | Vercel | Auto-deploy, Next.js native, free tier |
| Package manager | pnpm | Faster installs, stricter dependency resolution |
| Currency storage | Integer NUMERIC(12,0) | NTD has no decimals — avoids all float precision bugs |
| Month key format | CHAR(7) "YYYY-MM" | Human-readable, sortable lexicographically, easy to validate |
| Data model | One row per month | Matches mental model: "I update this once a month" |
| variableItems | Optional JSONB in record | Total is mandatory; categories are optional personal insight |
| ETF amount | Configurable in settings, default 24000 | Current value, but life changes |
| Color mode | Dark mode primary | Personal tool, night use, cleaner aesthetic |
| Charts | recharts | Simple React-native API, good enough for a bar/line chart |
| Styling | CSS variables + Tailwind | Theme-able, consistent across dark/light, no runtime overhead |
| Finance logic | Pure functions in lib/finance.ts | Testable, no side effects, single source of truth |
