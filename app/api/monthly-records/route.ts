import { NextResponse } from 'next/server'
import {
  rowToMonthlyRecord,
  type MonthlyRecordRow,
} from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
import type { ApiResponse, MonthlyRecord } from '@/types'

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
    data: (data as MonthlyRecordRow[]).map(rowToMonthlyRecord),
    error: null,
  }
  return NextResponse.json(body)
}
