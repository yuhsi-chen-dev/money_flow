import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn, formatCurrency, formatYM } from '@/lib/utils'
import type { HistoryMonth, Locale } from '@/types'

interface Props {
  months: HistoryMonth[]
}

export function MonthTable({ months }: Props) {
  const t = useTranslations('history.table')
  const locale = useLocale() as Locale
  const sorted = [...months].sort((a, b) => (a.ym < b.ym ? 1 : -1))
  const hasAny = sorted.some((m) => !m.calc.isProjection)

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-16 text-center text-sm text-[var(--color-text-tertiary)]">
        {t('noRecords')}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">
            <Th className="text-left">{t('month')}</Th>
            <Th>{t('income')}</Th>
            <Th>{t('fixed')}</Th>
            <Th>{t('variable')}</Th>
            <Th>{t('totalSavings')}</Th>
            <Th>{t('etf')}</Th>
            <Th>{t('extra')}</Th>
            <Th className="text-right">{t('actions')}</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ ym, calc }) => {
            const recorded = !calc.isProjection
            return (
              <tr
                key={ym}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <Td className="text-left font-medium text-[var(--color-text-primary)]">
                  {formatYM(ym, locale)}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalIncome, locale) : t('empty')}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalFixed, locale) : t('empty')}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.variableTotal, locale) : t('empty')}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalSavings, locale) : t('empty')}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.etfAmount, locale) : t('empty')}
                </Td>
                <Td
                  className={cn(
                    'font-semibold',
                    recorded && calc.extraSavings >= 0
                      ? 'text-[var(--color-success)]'
                      : recorded
                        ? 'text-[var(--color-danger)]'
                        : 'text-[var(--color-text-tertiary)]'
                  )}
                >
                  {recorded ? formatCurrency(calc.extraSavings, locale) : t('empty')}
                </Td>
                <Td className="text-right">
                  <Link
                    href={`/month/${ym}`}
                    className="text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                  >
                    {t('edit')}
                  </Link>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-right font-medium first:pl-6 last:pr-6',
        className
      )}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  className,
  muted,
}: {
  children: React.ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-right tabular-nums first:pl-6 last:pr-6',
        muted && 'text-[var(--color-text-tertiary)]',
        !muted && 'text-[var(--color-text-primary)]',
        className
      )}
    >
      {children}
    </td>
  )
}
