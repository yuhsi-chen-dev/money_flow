import type { MonthCalculation, MonthlyRecord, UserSettings } from '@/types'

export function calculateMonth(
  settings: UserSettings,
  record: MonthlyRecord | null
): MonthCalculation {
  const bonus = record?.bonus ?? 0
  const variableTotal = record?.variableTotal ?? 0

  const totalIncome = settings.monthlyIncome + bonus
  const totalFixed = settings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
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
