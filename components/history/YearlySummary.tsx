import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn, formatCurrency, formatYM } from '@/lib/utils'
import type { HistoryMonth, Locale } from '@/types'

interface Props {
  months: HistoryMonth[]
}

interface Stats {
  total: number
  average: number
  best: HistoryMonth | null
  worst: HistoryMonth | null
  recordedCount: number
}

function summarize(months: HistoryMonth[]): Stats {
  const recorded = months.filter((m) => !m.calc.isProjection)
  if (recorded.length === 0) {
    return { total: 0, average: 0, best: null, worst: null, recordedCount: 0 }
  }
  const total = recorded.reduce((sum, m) => sum + m.calc.extraSavings, 0)
  const average = Math.round(total / recorded.length)
  let best = recorded[0]!
  let worst = recorded[0]!
  for (const m of recorded) {
    if (m.calc.extraSavings > best.calc.extraSavings) best = m
    if (m.calc.extraSavings < worst.calc.extraSavings) worst = m
  }
  return { total, average, best, worst, recordedCount: recorded.length }
}

export function YearlySummary({ months }: Props) {
  const t = useTranslations('history.summary')
  const locale = useLocale() as Locale
  const stats = summarize(months)
  const empty = stats.recordedCount === 0
  const emptyLabel = t('empty')

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <SummaryCard
        label={t('yearTotal')}
        value={stats.total}
        tone={empty ? undefined : stats.total >= 0 ? 'success' : 'danger'}
        empty={empty}
        emptyLabel={emptyLabel}
        locale={locale}
      />
      <SummaryCard
        label={t('monthAverage')}
        value={stats.average}
        tone={empty ? undefined : stats.average >= 0 ? 'success' : 'danger'}
        empty={empty}
        emptyLabel={emptyLabel}
        locale={locale}
      />
      <SummaryCard
        label={t('bestMonth')}
        value={stats.best?.calc.extraSavings ?? 0}
        subtitle={stats.best ? formatYM(stats.best.ym, locale) : emptyLabel}
        tone={empty ? undefined : 'success'}
        empty={empty}
        emptyLabel={emptyLabel}
        locale={locale}
      />
      <SummaryCard
        label={t('worstMonth')}
        value={stats.worst?.calc.extraSavings ?? 0}
        subtitle={stats.worst ? formatYM(stats.worst.ym, locale) : emptyLabel}
        tone={empty ? undefined : 'danger'}
        empty={empty}
        emptyLabel={emptyLabel}
        locale={locale}
      />
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number
  subtitle?: string
  tone?: 'success' | 'danger'
  empty?: boolean
  emptyLabel: string
  locale: Locale
}

function SummaryCard({
  label,
  value,
  subtitle,
  tone,
  empty,
  emptyLabel,
  locale,
}: SummaryCardProps) {
  return (
    <Card padding="sm">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </div>
      {empty ? (
        <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-text-tertiary)]">
          {emptyLabel}
        </div>
      ) : (
        <>
          <div
            className={cn(
              'mt-2 text-2xl font-bold tabular-nums tracking-tight md:text-3xl',
              tone === 'success' && 'text-[var(--color-success)]',
              tone === 'danger' && 'text-[var(--color-danger)]',
              !tone && 'text-[var(--color-text-primary)]'
            )}
          >
            {formatCurrency(value, locale)}
          </div>
          {subtitle && (
            <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {subtitle}
            </div>
          )}
        </>
      )}
    </Card>
  )
}
