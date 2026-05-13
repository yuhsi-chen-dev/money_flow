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
  params: { locale: string }
  searchParams: { ym?: string }
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const t = await getTranslations('dashboard')
  const locale = (await getLocale()) as Locale
  const currentYM = getCurrentYM()
  const requestedYM = searchParams.ym ?? currentYM

  if (searchParams.ym && !isValidYM(searchParams.ym)) {
    redirect({ href: '/dashboard', locale: params.locale })
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
    redirect({ href: '/welcome', locale: params.locale })
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
