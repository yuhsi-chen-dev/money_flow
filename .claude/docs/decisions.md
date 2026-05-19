# Decisions Log

> Consult when: revisiting "why did we pick X?" before proposing a different approach.

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
| i18n library | next-intl | App Router native; supports both server and client components without juggling providers |
| Locale persistence | URL prefix (`/zh-TW/...`, `/en/...`) | SEO-friendly, shareable, no client/server hydration mismatch — URL is the source of truth |
| Default locale (routing) | en | Always the default URL prefix; `localeDetection: false` means Accept-Language and the locale cookie are ignored, the `LocaleToggle` is the only way to switch |
| Source-of-truth language (translation) | zh-TW | Every new string is written in `zh-TW` first then mirrored to `en` — the owner thinks in zh-TW even if the URL default is `en` |
| Currency symbol across locales | Always "NT$" | App is NTD-only — symbol stays; only thousand-separator grouping localizes |
