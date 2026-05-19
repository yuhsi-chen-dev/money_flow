'use client'

import { useCallback } from 'react'
import type { ApiResponse, FixedExpenseItem, UserSettings, VariableItem } from '@/types'

export interface SettingsInput {
  monthlyIncome: number
  etfAmount: number
  fixedExpenses: FixedExpenseItem[]
  defaultVariableItems: VariableItem[]
}

interface UseSettingsSaveResult {
  save: (input: SettingsInput) => Promise<UserSettings>
}

export function useSettingsSave(): UseSettingsSaveResult {
  const save = useCallback(async (input: SettingsInput): Promise<UserSettings> => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = (await res.json()) as ApiResponse<UserSettings>
    if (json.error) {
      throw new Error(json.error.message)
    }
    return json.data
  }, [])

  return { save }
}
