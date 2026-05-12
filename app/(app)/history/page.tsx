import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Route } from 'next'
import { MonthTable } from '@/components/history/MonthTable'
import { SavingsTrendChart } from '@/components/history/SavingsTrendChart'
import { YearlySummary } from '@/components/history/YearlySummary'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { calculateMonth } from '@/lib/finance'
import { createServerClient } from '@/lib/supabase/server'
import type {
  FixedExpenseItem,
  HistoryMonth,
  MonthlyRecord,
  UserSettings,
  VariableItem,
} from '@/types'

interface PageProps {
  searchParams: { year?: string }
}

function isValidYear(year: string): boolean {
  return /^\d{4}$/.test(year)
}

function getCurrentYear(): number {
  return new Date().getFullYear()
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const currentYear = getCurrentYear()
  const yearParam = searchParams.year
  const year =
    yearParam && isValidYear(yearParam) ? parseInt(yearParam, 10) : currentYear

  if (yearParam && !isValidYear(yearParam)) {
    redirect('/history' as Route)
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

  const { data: recordRows } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('year_month', `${year}-01`)
    .lte('year_month', `${year}-12`)

  const recordsByYM = new Map<string, MonthlyRecord>()
  for (const row of recordRows ?? []) {
    const ym = row.year_month as string
    recordsByYM.set(ym, {
      id: row.id,
      userId: row.user_id,
      yearMonth: ym,
      bonus: Number(row.bonus),
      variableTotal: Number(row.variable_total),
      variableItems: Array.isArray(row.variable_items)
        ? (row.variable_items as VariableItem[])
        : [],
      note: row.note ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  }

  const months: HistoryMonth[] = Array.from({ length: 12 }, (_, i) => {
    const monthStr = String(i + 1).padStart(2, '0')
    const ym = `${year}-${monthStr}`
    const record = recordsByYM.get(ym) ?? null
    return { ym, calc: calculateMonth(settings, record) }
  })

  return (
    <PageWrapper>
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
            歷史趨勢
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            每月額外儲蓄的長期變化。
          </p>
        </div>
        <YearSelector year={year} />
      </header>

      <div className="flex flex-col gap-10">
        <SavingsTrendChart months={months} />
        <YearlySummary months={months} />
        <MonthTable months={months} />
      </div>
    </PageWrapper>
  )
}

function YearSelector({ year }: { year: number }) {
  return (
    <nav
      aria-label="年份切換"
      className="flex shrink-0 items-center gap-3"
    >
      <Link
        href={`/history?year=${year - 1}` as Route}
        aria-label={`前一年：${year - 1}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        ←
      </Link>
      <span className="min-w-[5ch] text-center text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
        {year} 年
      </span>
      <Link
        href={`/history?year=${year + 1}` as Route}
        aria-label={`下一年：${year + 1}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        →
      </Link>
    </nav>
  )
}
