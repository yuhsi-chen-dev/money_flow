# MoneyFlow — Personal Finance Tracker
> 儲蓄 = 收入 - 固定支出 - 浮動支出

A minimalist personal finance tracker built around one formula and one goal:  
**Know exactly how much extra you saved this month.**

---

## Current Task

**Status:** 🛠 `/settings` "套用範本" starter templates (2026-05-14) — empty `/settings` is intimidating for first-time users. Each of the two list sections (固定支出 + 預設浮動支出範本) gets a 「套用範本」/"Load starter template" button inside its empty state. Both starter lists are locale-aware: 固定支出 → zh 房租/電信/網路/水電/訂閱, en Rent/Mobile/Internet/Utilities/Subscriptions; 預設浮動支出範本 → zh 食費/交通/娛樂/購物/醫療/其他, en Food/Transport/Entertainment/Shopping/Medical/Other. All starter rows seed amount `0`. The label loaded into each row is whatever the active locale renders — i.e. it is **persisted verbatim** in the user's saved data (no canonical zh-key rewrite). The button is only shown when the list is empty; once any row exists it disappears (the existing 「＋ 新增…」 button stays). Returning users still hydrate from their saved data — no auto-injection.

**Done so far (through 2026-05-13):**
- [x] Scaffold Next.js project with TypeScript + Tailwind + pnpm (upgraded to Next.js 16 on 2026-05-14)
- [x] Configure ESLint, Prettier, path aliases (`@/`)
- [x] Schema migration written at `supabase/migrations/0001_initial_schema.sql`
- [x] Supabase browser/server clients + session-refresh middleware
- [x] Build login page (Apple-style, Google OAuth) + `/auth/callback` + root redirect
- [x] App shell: Navbar + (auth)/(app) route groups + dark mode CSS variables
- [x] UI primitives: Button, Card, Input, Badge, Toast
- [x] `lib/finance.ts` + unit tests (11/11 passing)
- [x] Supabase project created + Google OAuth provider configured + `.env.local` populated
- [x] Auth flow verified end-to-end: `/login` → Google → `/auth/callback` → session cookie set → `/dashboard` (404 expected, no page yet)
- [x] `/settings` — page UI + `useSettings` hook + GET/PUT `/api/settings` (with validation), verified end-to-end in browser
- [x] `/dashboard` — SavingHero, FormulaBreakdown (6 cards), MonthSelector (?ym=… search param), settings guard → `/settings?reason=onboard`, CTA → `/month/[ym]`; added `shiftYM()` to `lib/utils`
- [x] `/month/[ym]` — VariableExpenseForm (浮動支出 + 獎金 toggle + 分類明細 toggle + 200-char 備註) with sticky LivePreview, `useMonthlyRecord` hook, GET + PATCH-upsert at `/api/monthly-records/[ym]`; save → toast → redirect to `/dashboard`
- [x] `/history` — recharts BarChart (Jan–Dec, color-coded bars + tooltip), YearlySummary 4-card grid, MonthTable with 編輯 links; year selector via `?year=…`; `GET /api/monthly-records` (with optional `?year=` filter); added `HistoryMonth` type
- [x] Dark / light mode toggle — attribute-based theming (`[data-theme="light"|"dark"]`) with system fallback; `mf-theme` localStorage key; sync inline script in `<head>` prevents FOUC; ThemeToggle (sun/moon SVG) in Navbar
- [x] Default 浮動支出 template — migration 0002 adds `default_variable_items`; 預設浮動支出範本 editor on `/settings`; `/month/[ym]` auto-opens the breakdown panel with seeded items and locks `variableTotal` to the items-sum while open; shared row mappers extracted to `lib/supabase/mappers.ts`
- [x] i18n with `next-intl@4.11` — URL-prefix routing (`/zh-TW`, `/en`), every UI string in `messages/{locale}.json`, locale-aware `formatYM`/`formatCurrency`, `LocaleToggle` in Navbar beside `ThemeToggle`; chained middleware (intl + Supabase session refresh) preserves the active locale through auth redirects
- [x] `/welcome` first-login intro — names the inspiration (Maggiulli《持續買進》), three Apple-minimal cards + 「開始設定 →」 CTA; shown only when `user_settings` is missing, repointed redirects from `/dashboard`, `/month/[ym]`, `/history` to land here
- [x] Mobile-first refinements — `/welcome` cards `<Reveal>` cascade (IntersectionObserver fade-up, stagger, respects prefers-reduced-motion), tighter mobile sizing across the page, Navbar collapses into a hamburger + full-screen overlay below `md`, ETF input no longer pre-fills 24000 and gains a placeholder hint
- [x] `/welcome` dual-mode + Navbar 理念/Philosophy entry — same cards in both onboarding and review modes, settings-state-driven CTA + Navbar rendering, new `nav.philosophy` and `welcome.ctaBack` i18n keys

**Queued after:**
- [ ] Deploy to Vercel — connect repo, copy env vars, set redirect URLs for Supabase Google OAuth to the production domain

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
| Framework | Next.js 16 (App Router) | Server components by default; Turbopack builds; `params`/`searchParams` are `Promise<...>` |
| Language | TypeScript 5 (strict mode) | No `any`, no `@ts-ignore` |
| Styling | Tailwind CSS v3 + CSS Variables | All colors via CSS variables |
| Database | Supabase (PostgreSQL) | Free tier is sufficient |
| Auth | Supabase Auth — Google OAuth | No email/password needed |
| Deployment | Vercel | Auto-deploy on push to main |
| Package Manager | pnpm | Faster, strict dependency graph |
| Linting | ESLint + Prettier | Auto-fix on save |
| Testing | Jest + React Testing Library | Unit tests for lib/finance.ts |
| Charts | recharts | History page only |
| i18n | next-intl | URL-prefix routing, server + client components, default locale `en` (zh-TW is the source-of-truth language) |

---

## Project Structure

```
moneyflow/
├── app/                              # Next.js App Router root
│   ├── [locale]/                     # Locale segment — "zh-TW" or "en"
│   │   ├── (auth)/                   # Auth route group — no Navbar
│   │   │   └── login/
│   │   │       └── page.tsx          # Google OAuth login page
│   │   ├── (app)/                    # Protected route group
│   │   │   ├── layout.tsx            # App shell: Navbar + session guard
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # 當月總覽 — main page
│   │   │   ├── month/
│   │   │   │   └── [ym]/
│   │   │   │       └── page.tsx      # 月底更新 — param format: YYYY-MM
│   │   │   ├── history/
│   │   │   │   └── page.tsx          # 歷史趨勢圖
│   │   │   └── settings/
│   │   │       └── page.tsx          # 設定固定收支
│   │   └── layout.tsx                # Wraps children in NextIntlClientProvider, sets <html lang={locale}>
│   ├── api/                          # NOT localized — stays at root
│   │   ├── monthly-records/
│   │   │   ├── route.ts              # GET (list all), POST (create)
│   │   │   └── [ym]/
│   │   │       └── route.ts          # GET, PATCH, DELETE by YYYY-MM
│   │   └── settings/
│   │       └── route.ts              # GET, PUT user settings
│   ├── layout.tsx                    # Root layout — fonts, metadata, theme (no locale)
│   └── globals.css                   # CSS variables + Tailwind base styles
│
├── i18n/
│   └── request.ts                    # next-intl: loads messages/{locale}.json per request
├── messages/
│   ├── zh-TW.json                    # Traditional Chinese strings (source-of-truth language)
│   └── en.json                       # English strings (default locale for routing)
├── middleware.ts                     # Chains next-intl locale middleware with Supabase session refresh
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
│   │   ├── Navbar.tsx                # Fixed top nav with links + active state + ThemeToggle + LocaleToggle
│   │   ├── PageWrapper.tsx           # max-w-5xl, padding, pt-14 for nav offset
│   │   ├── ThemeToggle.tsx           # Sun/moon SVG, mf-theme localStorage
│   │   └── LocaleToggle.tsx          # 中/EN pill — router.replace(samePath under other locale prefix)
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
│   └── useSettings.ts                # Fetch + mutate user settings
│
├── types/
│   └── index.ts                      # All shared TypeScript interfaces
│
├── supabase/
│   └── migrations/
│       ├── 0001_initial_schema.sql           # Full schema — DO NOT edit
│       └── 0002_default_variable_items.sql   # Adds default_variable_items column
│
├── __tests__/
│   └── finance.test.ts               # Unit tests for lib/finance.ts
│
├── .claude/
│   ├── docs/                         # Topic deep-dives consulted on-demand (see index below)
│   └── settings.local.json           # Local Claude Code permission cache — gitignored
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

## Documentation Index

The root `CLAUDE.md` is intentionally slim. Topic-specific deep-dives live in `.claude/docs/` and should be consulted **on-demand** when you're working in the matching area — read the file at the top of that task before writing code.

| Topic | File | Read this when… |
|---|---|---|
| Design system | [`.claude/docs/design-system.md`](.claude/docs/design-system.md) | Building / restyling any UI — colors, typography, component patterns, spacing |
| Database schema | [`.claude/docs/database.md`](.claude/docs/database.md) | Writing migrations or API routes; needing exact table/RLS shape |
| TypeScript types | [`.claude/docs/types.md`](.claude/docs/types.md) | Defining / adjusting shared interfaces or DEFAULT_CATEGORIES |
| Core library functions | [`.claude/docs/lib.md`](.claude/docs/lib.md) | Touching `lib/finance.ts`, `lib/utils.ts`, or currency / date formatting |
| Coding conventions | [`.claude/docs/conventions.md`](.claude/docs/conventions.md) | Writing any TS/React code — TypeScript rules, monetary, data-fetching, imports |
| Internationalization | [`.claude/docs/i18n.md`](.claude/docs/i18n.md) | Adding strings, routing changes, locale toggle, `messages/*.json` |
| API conventions | [`.claude/docs/api.md`](.claude/docs/api.md) | Adding / editing anything under `app/api/**` |
| Pages spec & edge cases | [`.claude/docs/pages.md`](.claude/docs/pages.md) | Building / modifying any page; checking expected behavior for a scenario |
| Git workflow | [`.claude/docs/git-workflow.md`](.claude/docs/git-workflow.md) | Drafting commits, splitting work, naming a scope |
| Env vars & commands | [`.claude/docs/env-and-commands.md`](.claude/docs/env-and-commands.md) | Setting up a machine, recalling a `pnpm` script |
| Decisions log | [`.claude/docs/decisions.md`](.claude/docs/decisions.md) | Revisiting "why did we pick X?" before proposing a different approach |

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
- ❌ Never hardcode user-visible strings — every UI string must go through `t()` / `getTranslations()` against `messages/{locale}.json`
- ❌ Never link to a path without its locale prefix (`/dashboard` ❌ — use `next-intl`'s `Link` or build paths from `useLocale()` / route params)

---

## Current Status

- [x] Project scaffold: Next.js 14, TypeScript, Tailwind, pnpm
- [x] ESLint + Prettier configured
- [x] Path aliases configured (`@/`)
- [x] Supabase project created
- [~] Schema migration run (0001_initial_schema.sql) — verify in Table Editor before building API routes
- [x] Google OAuth configured in Supabase Auth settings
- [x] `.env.local` populated with Supabase credentials
- [x] Login page built and Google OAuth working (verified end-to-end)
- [x] App shell: Navbar + layout + dark mode CSS variables
- [x] UI primitives: Button, Card, Input, Badge, Toast
- [x] Settings page + GET/PUT API route working
- [x] Dashboard page working (projection + real record state)
- [x] Month update page working with live preview
- [x] History page with recharts chart + summary stats
- [x] Dark / light mode manual toggle (persisted in localStorage)
- [x] Default 浮動支出 template (configured in /settings, seeds /month/[ym] form)
- [x] i18n with `next-intl` — URL-prefix routing, `en` (default) + `zh-TW`, LocaleToggle in Navbar
- [ ] Deployed to Vercel
- [ ] Custom domain (optional)
