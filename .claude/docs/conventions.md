# Coding Conventions

> Consult when: writing or reviewing any TypeScript / React code, or wiring a new component / hook / API route.

## TypeScript
- Strict mode always — `"strict": true` in tsconfig.json
- No `any` — use `unknown` if type is truly unknown, then narrow it
- No `@ts-ignore` or `@ts-expect-error`
- Props interface at top of each component file: `interface Props { ... }`
- Named exports for all components, default export for all pages

## Monetary Values
- **Always integers** — NTD has no decimal places
- Use `parseInt()` or `Math.round()`, never `parseFloat()` for money
- DB column is `NUMERIC(12, 0)` — no float ever stored
- Always display with `formatCurrency()` — never raw number in UI

## Components
- One component per file; filename matches export name
- Use `cn()` from `lib/utils.ts` for all conditional class merging
- No inline `style={{}}` except for CSS variable dynamic values
- All theme colors via CSS variables: `text-[var(--color-text-primary)]`
- **No hardcoded user-visible strings** — every label, placeholder, button, toast, validation message, and badge text comes from `messages/{locale}.json` via `t()` / `getTranslations()`. Hardcoded strings are only allowed for non-UI values (CSS classes, data keys, log statements).

## Data Fetching
- Server Components: fetch directly via `createServerClient()` — no hooks needed
- Client Components: always use custom hooks from `/hooks/`
- Never call `fetch()` or Supabase directly inside a Client Component body
- Never use `useEffect` for data fetching — wrap in a custom hook

## Error Handling
- All async utility functions return `Result<T>`
- API routes always catch and return structured error shape
- UI always shows errors via Toast — never `alert()`, never silent failure

## Imports Order
1. External libraries (`react`, `next/...`, `recharts`)
2. Internal lib/utils (`@/lib/...`)
3. Internal hooks (`@/hooks/...`)
4. Internal components (`@/components/...`)
5. Types (`@/types`)
