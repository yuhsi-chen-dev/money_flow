import { useLocale, useTranslations } from 'next-intl'
import { cn, formatCurrency } from '@/lib/utils'
import type { Locale, MonthCalculation } from '@/types'

interface Props {
  calc: MonthCalculation
}

export function LivePreview({ calc }: Props) {
  const t = useTranslations('preview')
  const locale = useLocale() as Locale
  const positive = calc.extraSavings >= 0

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {t('title')}
      </div>

      <dl className="mt-5 flex flex-col gap-2.5 text-sm">
        <Row label={t('income')} value={calc.totalIncome} locale={locale} />
        <Row label={t('fixed')} value={-calc.totalFixed} locale={locale} />
        <Row label={t('variable')} value={-calc.variableTotal} locale={locale} />
        <Row label={t('etf')} value={-calc.etfAmount} locale={locale} />
      </dl>

      <div className="mt-6 border-t border-[var(--color-border)] pt-5">
        <div className="text-xs text-[var(--color-text-secondary)]">{t('extra')}</div>
        <div
          className={cn(
            'mt-1 font-display text-4xl font-bold tabular-nums tracking-tight',
            positive
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-danger)]'
          )}
        >
          {formatCurrency(calc.extraSavings, locale)}
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  locale,
}: {
  label: string
  value: number
  locale: Locale
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatCurrency(value, locale)}
      </dd>
    </div>
  )
}
