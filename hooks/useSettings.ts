'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ApiResponse, FixedExpenseItem, UserSettings } from '@/types'

export interface SettingsInput {
  monthlyIncome: number
  etfAmount: number
  fixedExpenses: FixedExpenseItem[]
}

interface UseSettingsResult {
  settings: UserSettings | null
  loading: boolean
  error: string | null
  save: (input: SettingsInput) => Promise<UserSettings>
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        const json = (await res.json()) as ApiResponse<UserSettings | null>
        if (cancelled) return
        if (json.error) {
          setError(json.error.message)
        } else {
          setSettings(json.data)
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

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
    setSettings(json.data)
    return json.data
  }, [])

  return { settings, loading, error, save }
}
