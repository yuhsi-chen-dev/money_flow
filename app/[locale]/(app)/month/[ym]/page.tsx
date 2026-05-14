import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { VariableExpenseForm } from '@/components/month/VariableExpenseForm'
import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  rowToSettings,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
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

      <VariableExpenseForm ym={ym} settings={settings} />
    </PageWrapper>
  )
}
