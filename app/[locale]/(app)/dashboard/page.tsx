import { getLocale, getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { SavingHero } from '@/components/dashboard/SavingHero'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { calculateMonth } from '@/lib/finance'
import {
  rowToMonthlyRecord,
  rowToSettings,
  type MonthlyRecordRow,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
import { formatYM, getCurrentYM, isValidYM } from '@/lib/utils'
import type { Locale } from '@/types'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ ym?: string }>
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const { locale: paramLocale } = await params
  const { ym: ymParam } = await searchParams
  const t = await getTranslations('dashboard')
  const locale = (await getLocale()) as Locale
  const currentYM = getCurrentYM()
  const requestedYM = ymParam ?? currentYM

  if (ymParam && !isValidYM(ymParam)) {
    redirect({ href: '/dashboard', locale: paramLocale })
    return null
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect({ href: '/login', locale: paramLocale })
    return null
  }

  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settingsRow) {
    redirect({ href: '/welcome', locale: paramLocale })
    return null
  }

  const settings = rowToSettings(settingsRow as SettingsRow)

  const { data: recordRow } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('year_month', requestedYM)
    .maybeSingle()

  const record = recordRow
    ? rowToMonthlyRecord(recordRow as MonthlyRecordRow)
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
        variableItems={record?.variableItems ?? []}
      />
      <div className="mt-12 flex justify-center">
        <Link
          href={`/month/${requestedYM}`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
        >
          {t('ctaUpdate', { month: formatYM(requestedYM, locale) })}
        </Link>
      </div>
    </PageWrapper>
  )
}
