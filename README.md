<div align="center">

# MoneyFlow

**清楚知道這個月多存了多少**
*Know exactly how much extra you saved this month.*

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## The idea

```
儲蓄 = 收入 − 固定支出 − 浮動支出
```

Inspired by Nick Maggiulli's *Just Keep Buying*《持續買進》, MoneyFlow inverts the usual 記帳-app instinct. You **don't** log every coffee. You set your fixed monthly income and recurring expenses **once**, then spend ~30 seconds at month-end entering your total variable spend. After pay-yourself-first ETF 定期定額 comes out, what's left is the one number that matters:

> **額外儲蓄 — Extra Savings — how much you actually saved on top of the auto-invested floor.**

## What makes it different

- **One formula, that's the whole app.** No budgets, no category bar charts, no expense lifecycle. Just the equation above.
- **30 seconds a month.** Variable expenses are a single total; the category breakdown is optional, for the months you feel like it.
- **Pay yourself first.** A fixed monthly ETF auto-investment is subtracted *before* "savings" is even calculated — the floor is non-negotiable, the rest is gravy.
- **Bilingual.** Traditional Chinese (`/zh-TW`) + English (`/en`), one-tap toggle in the navbar. Default route is `/en`; locale detection is off (the URL is the source of truth).
- **Dark-mode-first, Apple-minimal.** Big numbers, generous whitespace, razor-sharp contrast, zero decorative flourishes.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, Server Components by default) |
| Language | TypeScript 5 (strict mode, no `any`) |
| Styling | Tailwind CSS v3 + CSS variables (full theme tokens) |
| Database | Supabase — PostgreSQL with Row Level Security |
| Auth | Supabase Auth — Google OAuth |
| i18n | `next-intl` 4 — URL-prefix routing, server + client components |
| Charts | recharts (history page only) |
| Testing | Jest + React Testing Library |
| Hosting | Vercel |
| Package manager | pnpm 10 |

## Run it locally

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env.local
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...           # server-only — never used in client code

# 3. Apply the schema
#   Paste supabase/migrations/0001_initial_schema.sql + 0002_default_variable_items.sql
#   into the Supabase SQL editor and run them.

# 4. Enable Google OAuth in Supabase → Authentication → Providers

# 5. Go
pnpm dev
#   → http://localhost:3000  (redirects to http://localhost:3000/en)
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` / `lint:fix` | ESLint (Next.js preset + Prettier) |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm test` / `test:watch` / `test:coverage` | Jest unit tests for `lib/finance.ts` |
| `pnpm supabase:types` | Regenerate TypeScript types from the live Supabase schema |

## Project shape

```
moneyflow/
├── app/
│   ├── [locale]/                # zh-TW + en route trees
│   │   ├── (auth)/              # login (no navbar)
│   │   ├── (app)/               # dashboard · history · settings · month/[ym]
│   │   └── welcome/             # onboarding + philosophy review (dual-mode)
│   ├── api/                     # GET / PATCH / PUT endpoints — never localized
│   └── auth/callback/           # OAuth callback handler
│
├── components/
│   ├── ui/                      # Button, Card, Input, Badge, Toast, ThemeToggle, Reveal
│   ├── layout/                  # Navbar (with mobile hamburger overlay), PageWrapper, LocaleToggle
│   ├── dashboard/               # SavingHero, FormulaBreakdown, MonthSelector
│   ├── month/                   # VariableExpenseForm, CategoryList, LivePreview
│   └── history/                 # SavingsTrendChart, YearlySummary, MonthTable
│
├── lib/
│   ├── finance.ts               # Pure savings-formula calculations — single source of truth
│   ├── supabase/                # Browser + server clients, row mappers, session middleware
│   ├── utils.ts                 # cn, formatYM, formatCurrency, getCurrentYM, shiftYM
│   └── constants.ts             # DEFAULT_CATEGORIES, ETF_AMOUNT
│
├── i18n/                        # next-intl routing + typed navigation helpers
├── messages/                    # zh-TW.json (source of truth) + en.json
├── middleware.ts                # Chains next-intl locale routing with Supabase session refresh
├── supabase/migrations/         # 0001_initial_schema.sql, 0002_default_variable_items.sql
└── __tests__/                   # Jest tests for lib/finance.ts (11/11 passing)
```

## Deploy

Configured for Vercel. Import the repo, accept the auto-detected Next.js + pnpm settings (don't override build / output / install commands), and add these three env vars to **Production · Preview · Development**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

One thing to remember after the first deploy: add your Vercel production URL to **Supabase → Authentication → URL Configuration → Redirect URLs**, otherwise the Google OAuth callback breaks.

## A note on this repo

This is a single-owner financial-clarity tool — not a multi-tenant SaaS, not a "TODO app for finance". The source is public for transparency and so anyone who likes the formula can fork it and adapt it to their own setup. The schema, copy, ETF amount, and design choices are all opinionated; bend them to your situation.

> **Design constraint:** Every feature must serve the formula. Reject scope creep.
