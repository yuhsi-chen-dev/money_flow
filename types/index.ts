// ── Settings ─────────────────────────────────────────────────
export interface FixedExpenseItem {
  id: string
  name: string
  amount: number
}

export interface UserSettings {
  id: string
  userId: string
  monthlyIncome: number
  etfAmount: number
  fixedExpenses: FixedExpenseItem[]
  createdAt: string
  updatedAt: string
}

// ── Monthly Records ──────────────────────────────────────────
export interface VariableItem {
  id: string
  category: string
  amount: number
  note?: string
}

export interface MonthlyRecord {
  id: string
  userId: string
  yearMonth: string
  bonus: number
  variableTotal: number
  variableItems: VariableItem[]
  note?: string
  createdAt: string
  updatedAt: string
}

// ── History (per-month calculation + ym for charts/tables) ──
export interface HistoryMonth {
  ym: string
  calc: MonthCalculation
}

// ── Finance Calculation Result ───────────────────────────────
export interface MonthCalculation {
  totalIncome: number
  totalFixed: number
  variableTotal: number
  totalSavings: number
  etfAmount: number
  extraSavings: number
  isProjection: boolean
}

// ── API Response Shape ───────────────────────────────────────
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string } }

// ── Internal Result Pattern ──────────────────────────────────
export type Result<T> = { data: T; error: null } | { data: null; error: Error }
