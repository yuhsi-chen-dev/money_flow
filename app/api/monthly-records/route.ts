import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
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

export async function GET(request: Request) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')

  let query = supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .order('year_month', { ascending: false })

  if (year) {
    if (!/^\d{4}$/.test(year)) {
      return jsonError('year must be YYYY', 'INVALID_QUERY', 400)
    }
    query = query.gte('year_month', `${year}-01`).lte('year_month', `${year}-12`)
  }

  const { data, error } = await query

  if (error) return jsonError(error.message, 'DB_ERROR', 500)

  const body: ApiResponse<MonthlyRecord[]> = {
    data: (data as RecordRow[]).map(rowToRecord),
    error: null,
  }
  return NextResponse.json(body)
}
