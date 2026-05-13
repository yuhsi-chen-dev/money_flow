import { getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { MonthTable } from '@/components/history/MonthTable'
import { SavingsTrendChart } from '@/components/history/SavingsTrendChart'
import { YearlySummary } from '@/components/history/YearlySummary'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { calculateMonth } from '@/lib/finance'
import {
  rowToMonthlyRecord,
  rowToSettings,
  type MonthlyRecordRow,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
import type { HistoryMonth, MonthlyRecord } from '@/types'

interface PageProps {
  params: { locale: string }
  searchParams: { year?: string }
}

function isValidYear(year: string): boolean {
  return /^\d{4}$/.test(year)
}

function getCurrentYear(): number {
  return new Date().getFullYear()
}

export default async function HistoryPage({ params, searchParams }: PageProps) {
  const t = await getTranslations('history')
  const currentYear = getCurrentYear()
  const yearParam = searchParams.year
  const year =
    yearParam && isValidYear(yearParam) ? parseInt(yearParam, 10) : currentYear

  if (yearParam && !isValidYear(yearParam)) {
    redirect({ href: '/history', locale: params.locale })
    return null
  }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect({ href: '/login', locale: params.locale })
    return null
  }

  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settingsRow) {
    redirect({
      href: { pathname: '/settings', query: { reason: 'onboard' } },
      locale: params.locale,
    })
    return null
  }

  const settings = rowToSettings(settingsRow as SettingsRow)

  const { data: recordRows } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('year_month', `${year}-01`)
    .lte('year_month', `${year}-12`)

  const recordsByYM = new Map<string, MonthlyRecord>()
  for (const row of (recordRows ?? []) as MonthlyRecordRow[]) {
    const record = rowToMonthlyRecord(row)
    recordsByYM.set(record.yearMonth, record)
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
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t('subtitle')}
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

async function YearSelector({ year }: { year: number }) {
  const t = await getTranslations('history.yearSelector')
  return (
    <nav aria-label={t('label')} className="flex shrink-0 items-center gap-3">
      <Link
        href={{ pathname: '/history', query: { year: year - 1 } }}
        aria-label={t('prev', { year: year - 1 })}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        ←
      </Link>
      <span className="min-w-[5ch] text-center text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
        {t('current', { year })}
      </span>
      <Link
        href={{ pathname: '/history', query: { year: year + 1 } }}
        aria-label={t('next', { year: year + 1 })}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        →
      </Link>
    </nav>
  )
}
