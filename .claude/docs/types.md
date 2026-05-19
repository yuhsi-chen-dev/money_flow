# TypeScript Types & Constants

> Consult when: defining/adjusting shared interfaces, adding categories, or wiring new fields between API ↔ UI.

## Shared interfaces — `types/index.ts`

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
  defaultVariableItems: VariableItem[]   // template that seeds /month/[ym]
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

## Constants — `lib/constants.ts`

```typescript
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
