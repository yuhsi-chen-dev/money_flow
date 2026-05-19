import { getTranslations } from 'next-intl/server'
import { Link, redirect } from '@/i18n/navigation'
import { LocaleToggle } from '@/components/layout/LocaleToggle'
import { Navbar } from '@/components/layout/Navbar'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import { createServerClient, getAuthUser } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function WelcomePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('welcome')
  const tCommon = await getTranslations('common')

  const user = await getAuthUser()
  if (!user) {
    redirect({ href: '/login', locale })
    return null
  }

  const supabase = await createServerClient()
  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const hasSettings = !!settingsRow

  return (
    <>
      {hasSettings && <Navbar />}
      <main
        className={cn(
          'relative mx-auto min-h-screen w-full max-w-4xl px-4 pb-20 md:px-8 md:pb-32',
          hasSettings ? 'pt-20 md:pt-28' : 'pt-8 md:pt-16'
        )}
      >
        {!hasSettings && (
          <div className="absolute right-3 top-3 md:right-8 md:top-6">
            <LocaleToggle />
          </div>
        )}

        <Reveal>
          <header className="mt-10 text-center md:mt-20">
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-8xl">
              {tCommon('appName')}
            </h1>
            <p className="mt-4 text-base text-[var(--color-text-secondary)] md:mt-8 md:text-xl">
              {t('tagline')}
            </p>
          </header>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6 md:mt-28 md:gap-10">
          <Reveal delay={120}>
            <FeatureCard step="01">
              <CardTitle>{t('cards.formula.title')}</CardTitle>
              <p className="mt-6 text-center font-mono text-xl font-semibold tracking-tight text-[var(--color-accent)] md:mt-10 md:text-3xl lg:text-4xl">
                {t('cards.formula.equation')}
              </p>
              <CardBody>{t('cards.formula.body')}</CardBody>
            </FeatureCard>
          </Reveal>

          <Reveal delay={220}>
            <FeatureCard step="02">
              <CardTitle>{t('cards.different.title')}</CardTitle>
              <CardBody>{t('cards.different.body')}</CardBody>
            </FeatureCard>
          </Reveal>

          <Reveal delay={320}>
            <FeatureCard step="03">
              <CardTitle>{t('cards.extra.title')}</CardTitle>
              <CardBody>{t('cards.extra.body')}</CardBody>
            </FeatureCard>
          </Reveal>
        </div>

        <Reveal delay={420}>
          <div className="mt-12 flex justify-center md:mt-24">
            <Link
              href={hasSettings ? '/dashboard' : '/settings'}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--color-accent)] px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:gap-3.5 active:scale-[0.98] md:px-10 md:py-4 md:text-lg"
            >
              <span>{hasSettings ? t('ctaBack') : t('cta')}</span>
              <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </main>
    </>
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
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-12">
      <div className="font-mono text-xs font-semibold tracking-[0.3em] text-[var(--color-accent)]">
        {step}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
      {children}
    </h2>
  )
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)] md:mt-6 md:text-lg">
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
