import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { VariableExpenseForm } from '@/components/month/VariableExpenseForm'
import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  rowToMonthlyRecord,
  rowToSettings,
  type MonthlyRecordRow,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient, getAuthUser } from '@/lib/supabase/server'
import { formatYM, isValidYM } from '@/lib/utils'
import type { Locale } from '@/types'

interface PageProps {
  params: Promise<{ locale: string; ym: string }>
}

export default async function MonthPage({ params }: PageProps) {
  const { locale: paramLocale, ym } = await params
  if (!isValidYM(ym)) {
    notFound()
  }

  const t = await getTranslations('month')
  const locale = (await getLocale()) as Locale

  const user = await getAuthUser()
  if (!user) {
    redirect({ href: '/login', locale: paramLocale })
    return null
  }

  const supabase = await createServerClient()
  const [settingsResult, recordResult] = await Promise.all([
    supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('monthly_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('year_month', ym)
      .maybeSingle(),
  ])

  if (!settingsResult.data) {
    redirect({ href: '/welcome', locale: paramLocale })
    return null
  }

  const settings = rowToSettings(settingsResult.data as SettingsRow)
  const initialRecord = recordResult.data
    ? rowToMonthlyRecord(recordResult.data as MonthlyRecordRow)
    : null

  return (
    <PageWrapper>
      <header className="mb-10 flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label={t('backToOverview')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
        >
          ←
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
            {t('headerTitle', { month: formatYM(ym, locale) })}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {t('subtitle')}
          </p>
        </div>
      </header>

      <VariableExpenseForm
        ym={ym}
        settings={settings}
        initialRecord={initialRecord}
      />
    </PageWrapper>
  )
}
