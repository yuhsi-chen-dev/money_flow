import { calculateMonth, getSavingsColor, getTotalFixed } from '@/lib/finance'
import type { MonthlyRecord, UserSettings } from '@/types'

function makeSettings(overrides: Partial<UserSettings> = {}): UserSettings {
  return {
    id: 'settings-1',
    userId: 'user-1',
    monthlyIncome: 60000,
    etfAmount: 24000,
    fixedExpenses: [
      { id: 'f1', name: '房租', amount: 18000 },
      { id: 'f2', name: 'Netflix', amount: 390 },
    ],
    defaultVariableItems: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeRecord(overrides: Partial<MonthlyRecord> = {}): MonthlyRecord {
  return {
    id: 'rec-1',
    userId: 'user-1',
    yearMonth: '2026-05',
    bonus: 0,
    variableTotal: 10000,
    variableItems: [],
    createdAt: '2026-05-31T00:00:00Z',
    updatedAt: '2026-05-31T00:00:00Z',
    ...overrides,
  }
}

describe('calculateMonth', () => {
  it('returns a projection when no record exists', () => {
    const result = calculateMonth(makeSettings(), null)
    expect(result.isProjection).toBe(true)
    expect(result.variableTotal).toBe(0)
    expect(result.totalIncome).toBe(60000)
    expect(result.totalFixed).toBe(18390)
    expect(result.totalSavings).toBe(60000 - 18390)
    expect(result.extraSavings).toBe(60000 - 18390 - 24000)
  })

  it('uses record values when a record is provided', () => {
    const result = calculateMonth(makeSettings(), makeRecord({ variableTotal: 10000 }))
    expect(result.isProjection).toBe(false)
    expect(result.variableTotal).toBe(10000)
    expect(result.totalSavings).toBe(60000 - 18390 - 10000)
    expect(result.extraSavings).toBe(60000 - 18390 - 10000 - 24000)
  })

  it('adds bonus to total income', () => {
    const result = calculateMonth(makeSettings(), makeRecord({ bonus: 5000, variableTotal: 0 }))
    expect(result.totalIncome).toBe(65000)
    expect(result.extraSavings).toBe(65000 - 18390 - 0 - 24000)
  })

  it('produces a negative extraSavings when spending exceeds budget', () => {
    const result = calculateMonth(
      makeSettings({ monthlyIncome: 40000 }),
      makeRecord({ variableTotal: 5000 })
    )
    expect(result.extraSavings).toBeLessThan(0)
  })

  it('treats an empty fixedExpenses list as zero', () => {
    const result = calculateMonth(makeSettings({ fixedExpenses: [] }), null)
    expect(result.totalFixed).toBe(0)
    expect(result.totalSavings).toBe(60000)
  })

  it('respects a custom etfAmount', () => {
    const result = calculateMonth(makeSettings({ etfAmount: 10000 }), null)
    expect(result.etfAmount).toBe(10000)
    expect(result.extraSavings).toBe(60000 - 18390 - 10000)
  })

  it('handles zero income gracefully', () => {
    const result = calculateMonth(
      makeSettings({ monthlyIncome: 0, fixedExpenses: [], etfAmount: 0 }),
      null
    )
    expect(result.totalIncome).toBe(0)
    expect(result.totalSavings).toBe(0)
    expect(result.extraSavings).toBe(0)
  })
})

describe('getTotalFixed', () => {
  it('sums all fixed expense amounts', () => {
    expect(getTotalFixed(makeSettings())).toBe(18390)
  })

  it('returns 0 for an empty list', () => {
    expect(getTotalFixed(makeSettings({ fixedExpenses: [] }))).toBe(0)
  })
})

describe('getSavingsColor', () => {
  it('returns success for non-negative values', () => {
    expect(getSavingsColor(0)).toBe('success')
    expect(getSavingsColor(1000)).toBe('success')
  })

  it('returns danger for negative values', () => {
    expect(getSavingsColor(-1)).toBe('danger')
    expect(getSavingsColor(-10000)).toBe('danger')
  })
})
