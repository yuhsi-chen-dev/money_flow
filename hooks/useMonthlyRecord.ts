'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ApiResponse, MonthlyRecord, VariableItem } from '@/types'

export interface MonthlyRecordInput {
  variableTotal: number
  bonus: number
  variableItems: VariableItem[]
  note?: string
}

interface UseMonthlyRecordResult {
  record: MonthlyRecord | null
  loading: boolean
  error: string | null
  save: (input: MonthlyRecordInput) => Promise<MonthlyRecord>
}

export function useMonthlyRecord(ym: string): UseMonthlyRecordResult {
  const [record, setRecord] = useState<MonthlyRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    async function load() {
      try {
        const res = await fetch(`/api/monthly-records/${ym}`, { cache: 'no-store' })
        const json = (await res.json()) as ApiResponse<MonthlyRecord | null>
        if (cancelled) return
        if (json.error) {
          setError(json.error.message)
        } else {
          setRecord(json.data)
          setError(null)
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load record')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [ym])

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
      setRecord(json.data)
      return json.data
    },
    [ym]
  )

  return { record, loading, error, save }
}
