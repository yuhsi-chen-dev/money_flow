# Core Library Functions

> Consult when: touching finance math, currency/date formatting, or class-name composition.

## Finance Logic — `lib/finance.ts`

**All calculations live exclusively in `lib/finance.ts` as pure functions.**  
Never calculate inline in components, hooks, pages, or API routes. Always import from here.

```typescript
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

## Utility Functions — `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format NTD with locale-aware grouping. Currency symbol stays "NT$" in both locales.
//   formatCurrency(24000, 'zh-TW') → "NT$24,000"
//   formatCurrency(24000, 'en')    → "NT$24,000"
export function formatCurrency(amount: number, locale: Locale = 'zh-TW'): string {
  return `NT$${new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-TW').format(amount)}`
}

// Format YYYY-MM for display:
//   formatYM('2025-01', 'zh-TW') → "2025年1月"
//   formatYM('2025-01', 'en')    → "Jan 2025"
export function formatYM(ym: string, locale: Locale = 'zh-TW'): string {
  const [year, month] = ym.split('-')
  if (locale === 'en') {
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  }
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
