import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatYM, shiftYM } from '@/lib/utils'
import type { Locale } from '@/types'

interface Props {
  ym: string
}

export function MonthSelector({ ym }: Props) {
  const t = useTranslations('dashboard.monthSelector')
  const locale = useLocale() as Locale
  const prev = shiftYM(ym, -1)
  const next = shiftYM(ym, 1)

  return (
    <nav aria-label={t('label')} className="flex items-center justify-center gap-4">
      <Link
        href={{ pathname: '/dashboard', query: { ym: prev } }}
        aria-label={t('prev', { month: formatYM(prev, locale) })}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        ←
      </Link>
      <span className="min-w-[8ch] text-center text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatYM(ym, locale)}
      </span>
      <Link
        href={{ pathname: '/dashboard', query: { ym: next } }}
        aria-label={t('next', { month: formatYM(next, locale) })}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        →
      </Link>
    </nav>
  )
}
