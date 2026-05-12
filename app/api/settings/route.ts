import { NextResponse } from 'next/server'
import { rowToSettings, type SettingsRow } from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
import type { ApiResponse, FixedExpenseItem, UserSettings, VariableItem } from '@/types'

function jsonError(message: string, code: string, status: number) {
  return NextResponse.json<ApiResponse<never>>(
    { data: null, error: { message, code } },
    { status }
  )
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function parseFixedExpenses(input: unknown): FixedExpenseItem[] | null {
  if (!Array.isArray(input)) return null
  const items: FixedExpenseItem[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    if (typeof r.id !== 'string' || r.id.length === 0) return null
    if (typeof r.name !== 'string') return null
    if (!isNonNegativeInt(r.amount)) return null
    items.push({ id: r.id, name: r.name.trim(), amount: r.amount })
  }
  return items
}

function parseVariableItems(input: unknown): VariableItem[] | null {
  if (!Array.isArray(input)) return null
  const items: VariableItem[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    if (typeof r.id !== 'string' || r.id.length === 0) return null
    if (typeof r.category !== 'string') return null
    if (!isNonNegativeInt(r.amount)) return null
    items.push({ id: r.id, category: r.category.trim(), amount: r.amount })
  }
  return items
}

export async function GET() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return jsonError(error.message, 'DB_ERROR', 500)

  const body: ApiResponse<UserSettings | null> = {
    data: data ? rowToSettings(data as SettingsRow) : null,
    error: null,
  }
  return NextResponse.json(body)
}

export async function PUT(request: Request) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonError('Invalid JSON', 'INVALID_BODY', 400)
  }
  if (!payload || typeof payload !== 'object') {
    return jsonError('Invalid body', 'INVALID_BODY', 400)
  }
  const body = payload as Record<string, unknown>

  if (!isNonNegativeInt(body.monthlyIncome)) {
    return jsonError('monthlyIncome must be a non-negative integer', 'INVALID_BODY', 400)
  }
  if (!isNonNegativeInt(body.etfAmount)) {
    return jsonError('etfAmount must be a non-negative integer', 'INVALID_BODY', 400)
  }
  const fixedExpenses = parseFixedExpenses(body.fixedExpenses)
  if (fixedExpenses === null) {
    return jsonError('fixedExpenses is invalid', 'INVALID_BODY', 400)
  }
  const defaultVariableItems = parseVariableItems(body.defaultVariableItems)
  if (defaultVariableItems === null) {
    return jsonError('defaultVariableItems is invalid', 'INVALID_BODY', 400)
  }

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: user.id,
        monthly_income: body.monthlyIncome,
        etf_amount: body.etfAmount,
        fixed_expenses: fixedExpenses,
        default_variable_items: defaultVariableItems,
      },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single()

  if (error) return jsonError(error.message, 'DB_ERROR', 500)

  const result: ApiResponse<UserSettings> = {
    data: rowToSettings(data as SettingsRow),
    error: null,
  }
  return NextResponse.json(result)
}
