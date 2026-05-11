import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidYM } from '@/lib/utils'
import type { ApiResponse, MonthlyRecord, VariableItem } from '@/types'

interface RecordRow {
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

const NOTE_MAX = 200

function rowToRecord(row: RecordRow): MonthlyRecord {
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

function jsonError(message: string, code: string, status: number) {
  return NextResponse.json<ApiResponse<never>>(
    { data: null, error: { message, code } },
    { status }
  )
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
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
    const item: VariableItem = {
      id: r.id,
      category: r.category.trim(),
      amount: r.amount,
    }
    if (typeof r.note === 'string' && r.note.length > 0) {
      item.note = r.note
    }
    items.push(item)
  }
  return items
}

interface RouteParams {
  params: { ym: string }
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!isValidYM(params.ym)) {
    return jsonError('Invalid year_month', 'INVALID_YM', 400)
  }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  const { data, error } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('year_month', params.ym)
    .maybeSingle()

  if (error) return jsonError(error.message, 'DB_ERROR', 500)

  const body: ApiResponse<MonthlyRecord | null> = {
    data: data ? rowToRecord(data as RecordRow) : null,
    error: null,
  }
  return NextResponse.json(body)
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isValidYM(params.ym)) {
    return jsonError('Invalid year_month', 'INVALID_YM', 400)
  }

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

  if (!isNonNegativeInt(body.variableTotal)) {
    return jsonError('variableTotal must be a non-negative integer', 'INVALID_BODY', 400)
  }
  if (!isNonNegativeInt(body.bonus)) {
    return jsonError('bonus must be a non-negative integer', 'INVALID_BODY', 400)
  }
  const variableItems = parseVariableItems(body.variableItems)
  if (variableItems === null) {
    return jsonError('variableItems is invalid', 'INVALID_BODY', 400)
  }
  let note: string | null = null
  if (body.note !== undefined && body.note !== null) {
    if (typeof body.note !== 'string') {
      return jsonError('note must be a string', 'INVALID_BODY', 400)
    }
    const trimmed = body.note.trim()
    if (trimmed.length > NOTE_MAX) {
      return jsonError(`note must be ${NOTE_MAX} characters or fewer`, 'INVALID_BODY', 400)
    }
    note = trimmed.length > 0 ? trimmed : null
  }

  const { data, error } = await supabase
    .from('monthly_records')
    .upsert(
      {
        user_id: user.id,
        year_month: params.ym,
        bonus: body.bonus,
        variable_total: body.variableTotal,
        variable_items: variableItems,
        note,
      },
      { onConflict: 'user_id,year_month' }
    )
    .select('*')
    .single()

  if (error) return jsonError(error.message, 'DB_ERROR', 500)

  const result: ApiResponse<MonthlyRecord> = {
    data: rowToRecord(data as RecordRow),
    error: null,
  }
  return NextResponse.json(result)
}
