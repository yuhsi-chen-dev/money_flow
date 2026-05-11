import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Route } from 'next'
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { SavingHero } from '@/components/dashboard/SavingHero'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { calculateMonth } from '@/lib/finance'
import { createServerClient } from '@/lib/supabase/server'
import { formatYM, getCurrentYM, isValidYM } from '@/lib/utils'
import type {
  FixedExpenseItem,
  MonthlyRecord,
  UserSettings,
  VariableItem,
} from '@/types'

interface PageProps {
  searchParams: { ym?: string }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const currentYM = getCurrentYM()
  const requestedYM = searchParams.ym ?? currentYM

  if (searchParams.ym && !isValidYM(searchParams.ym)) {
    redirect('/dashboard')
  }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settingsRow) {
    redirect('/settings?reason=onboard' as Route)
  }

  const settings: UserSettings = {
    id: settingsRow.id,
    userId: settingsRow.user_id,
    monthlyIncome: Number(settingsRow.monthly_income),
    etfAmount: Number(settingsRow.etf_amount),
    fixedExpenses: Array.isArray(settingsRow.fixed_expenses)
      ? (settingsRow.fixed_expenses as FixedExpenseItem[])
      : [],
    createdAt: settingsRow.created_at,
    updatedAt: settingsRow.updated_at,
  }

  const { data: recordRow } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('year_month', requestedYM)
    .maybeSingle()

  const record: MonthlyRecord | null = recordRow
    ? {
        id: recordRow.id,
        userId: recordRow.user_id,
        yearMonth: recordRow.year_month,
        bonus: Number(recordRow.bonus),
        variableTotal: Number(recordRow.variable_total),
        variableItems: Array.isArray(recordRow.variable_items)
          ? (recordRow.variable_items as VariableItem[])
          : [],
        note: recordRow.note ?? undefined,
        createdAt: recordRow.created_at,
        updatedAt: recordRow.updated_at,
      }
    : null

  const calc = calculateMonth(settings, record)

  return (
    <PageWrapper>
      <MonthSelector ym={requestedYM} />
      <SavingHero
        extraSavings={calc.extraSavings}
        isProjection={calc.isProjection}
      />
      <FormulaBreakdown
        calc={calc}
        monthlyIncome={settings.monthlyIncome}
        bonus={record?.bonus ?? 0}
        fixedExpenses={settings.fixedExpenses}
      />
      <div className="mt-12 flex justify-center">
        <Link
          href={`/month/${requestedYM}` as Route}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
        >
          更新{formatYM(requestedYM)}的浮動支出
        </Link>
      </div>
    </PageWrapper>
  )
}
