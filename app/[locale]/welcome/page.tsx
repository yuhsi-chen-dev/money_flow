import { getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { Card } from '@/components/ui/Card'
import { createServerClient } from '@/lib/supabase/server'

interface PageProps {
  params: { locale: string }
}

export default async function WelcomePage({ params }: PageProps) {
  const t = await getTranslations('welcome')
  const tCommon = await getTranslations('common')

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
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (settingsRow) {
    redirect({ href: '/dashboard', locale: params.locale })
    return null
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
      <header className="mb-12 text-center md:mb-16">
        <h1 className="font-display text-5xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl">
          {tCommon('appName')}
        </h1>
        <p className="mt-4 text-base text-[var(--color-text-secondary)] md:text-lg">
          {t('tagline')}
        </p>
      </header>

      <div className="flex flex-col gap-5 md:gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] md:text-2xl">
            {t('cards.formula.title')}
          </h2>
          <p className="mt-5 text-center font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
            {t('cards.formula.equation')}
          </p>
          <p className="mt-5 text-sm text-[var(--color-text-secondary)] md:text-base">
            {t('cards.formula.body')}
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] md:text-2xl">
            {t('cards.different.title')}
          </h2>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)] md:text-base">
            {t('cards.different.body')}
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] md:text-2xl">
            {t('cards.extra.title')}
          </h2>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)] md:text-base">
            {t('cards.extra.body')}
          </p>
        </Card>
      </div>

      <div className="mt-12 flex justify-center md:mt-16">
        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
        >
          {t('cta')} →
        </Link>
      </div>
    </main>
  )
}
