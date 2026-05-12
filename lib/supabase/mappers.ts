import type {
  FixedExpenseItem,
  MonthlyRecord,
  UserSettings,
  VariableItem,
} from '@/types'

export interface SettingsRow {
  id: string
  user_id: string
  monthly_income: number | string
  etf_amount: number | string
  fixed_expenses: FixedExpenseItem[]
  default_variable_items: VariableItem[]
  created_at: string
  updated_at: string
}

export interface MonthlyRecordRow {
  id: string
  user_id: string
  year_month: string
  bonus: number | string
  variable_total: number | string
  variable_items: VariableItem[]
  note: string | null
  created_at: string
  updated_at: string
}

export function rowToSettings(row: SettingsRow): UserSettings {
  return {
    id: row.id,
    userId: row.user_id,
    monthlyIncome: Number(row.monthly_income),
    etfAmount: Number(row.etf_amount),
    fixedExpenses: Array.isArray(row.fixed_expenses) ? row.fixed_expenses : [],
    defaultVariableItems: Array.isArray(row.default_variable_items)
      ? row.default_variable_items
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function rowToMonthlyRecord(row: MonthlyRecordRow): MonthlyRecord {
  return {
    id: row.id,
    userId: row.user_id,
    yearMonth: row.year_month,
    bonus: Number(row.bonus),
    variableTotal: Number(row.variable_total),
    variableItems: Array.isArray(row.variable_items) ? row.variable_items : [],
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
