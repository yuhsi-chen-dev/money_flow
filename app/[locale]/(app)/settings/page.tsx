import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { SettingsForm } from '@/components/settings/SettingsForm'
import {
  rowToSettings,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient, getAuthUser } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params
  const user = await getAuthUser()
  if (!user) {
    redirect({ href: '/login', locale })
    return null
  }

  const t = await getTranslations('settings')
  const supabase = await createServerClient()
  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const initialSettings = settingsRow
    ? rowToSettings(settingsRow as SettingsRow)
    : null

  return (
    <PageWrapper>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('subtitle')}
        </p>
      </header>

      <SettingsForm initialSettings={initialSettings} />
    </PageWrapper>
  )
}
