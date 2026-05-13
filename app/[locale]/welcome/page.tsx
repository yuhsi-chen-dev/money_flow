import { getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { LocaleToggle } from '@/components/layout/LocaleToggle'
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
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 pb-24 pt-12 md:px-8 md:pb-32 md:pt-16">
      <div className="absolute right-4 top-4 md:right-8 md:top-6">
        <LocaleToggle />
      </div>

      <header className="mt-12 text-center md:mt-20">
        <h1 className="font-display text-6xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-8xl">
          {tCommon('appName')}
        </h1>
        <p className="mt-6 text-lg text-[var(--color-text-secondary)] md:mt-8 md:text-xl">
          {t('tagline')}
        </p>
      </header>

      <div className="mt-20 flex flex-col gap-8 md:mt-28 md:gap-10">
        <FeatureCard step="01">
          <CardTitle>{t('cards.formula.title')}</CardTitle>
          <p className="mt-8 text-center font-mono text-2xl font-semibold tracking-tight text-[var(--color-accent)] md:mt-10 md:text-3xl lg:text-4xl">
            {t('cards.formula.equation')}
          </p>
          <CardBody>{t('cards.formula.body')}</CardBody>
        </FeatureCard>

        <FeatureCard step="02">
          <CardTitle>{t('cards.different.title')}</CardTitle>
          <CardBody>{t('cards.different.body')}</CardBody>
        </FeatureCard>

        <FeatureCard step="03">
          <CardTitle>{t('cards.extra.title')}</CardTitle>
          <CardBody>{t('cards.extra.body')}</CardBody>
        </FeatureCard>
      </div>

      <div className="mt-16 flex justify-center md:mt-24">
        <Link
          href="/settings"
          className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--color-accent)] px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:gap-3.5 active:scale-[0.98] md:text-lg"
        >
          <span>{t('cta')}</span>
          <ArrowRight />
        </Link>
      </div>
    </main>
  )
}

function FeatureCard({
  step,
  children,
}: {
  step: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 md:p-12">
      <div className="font-mono text-xs font-semibold tracking-[0.3em] text-[var(--color-accent)]">
        {step}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
      {children}
    </h2>
  )
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)] md:mt-6 md:text-lg">
      {children}
    </p>
  )
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}
