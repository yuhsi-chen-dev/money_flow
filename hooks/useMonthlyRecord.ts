'use client'

import { useCallback } from 'react'
import type { ApiResponse, MonthlyRecord, VariableItem } from '@/types'

export interface MonthlyRecordInput {
  variableTotal: number
  bonus: number
  variableItems: VariableItem[]
  note?: string
}

interface UseMonthlyRecordSaveResult {
  save: (input: MonthlyRecordInput) => Promise<MonthlyRecord>
}

export function useMonthlyRecordSave(ym: string): UseMonthlyRecordSaveResult {
  const save = useCallback(
    async (input: MonthlyRecordInput): Promise<MonthlyRecord> => {
      const res = await fetch(`/api/monthly-records/${ym}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = (await res.json()) as ApiResponse<MonthlyRecord>
      if (json.error) {
        throw new Error(json.error.message)
      }
      return json.data
    },
    [ym]
  )

  return { save }
}
