import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn, formatCurrency } from '@/lib/utils'
import type {
  FixedExpenseItem,
  Locale,
  MonthCalculation,
  VariableItem,
} from '@/types'

interface Props {
  calc: MonthCalculation
  monthlyIncome: number
  bonus: number
  fixedExpenses: FixedExpenseItem[]
  variableItems: VariableItem[]
}

export function FormulaBreakdown({
  calc,
  monthlyIncome,
  bonus,
  fixedExpenses,
  variableItems,
}: Props) {
  const t = useTranslations('dashboard.cards')
  const tCat = useTranslations('categories')
  const locale = useLocale() as Locale

  function translateCategory(category: string): string {
    if (!category) return t('empty')
    return tCat.has(category) ? tCat(category) : category
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatCard label={t('income')} value={calc.totalIncome} locale={locale}>
        <Row label={t('monthlyIncome')} value={monthlyIncome} locale={locale} />
        {bonus > 0 && <Row label={t('bonus')} value={bonus} locale={locale} />}
      </StatCard>

      <StatCard label={t('fixed')} value={calc.totalFixed} locale={locale}>
        {fixedExpenses.length > 0 ? (
          <details className="group mt-2">
            <summary className="cursor-pointer list-none text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]">
              {t('expandDetails', { count: fixedExpenses.length })}
            </summary>
            <ul className="mt-2 flex flex-col gap-1">
              {fixedExpenses.map((item) => (
                <Row
                  key={item.id}
                  label={item.name || t('empty')}
                  value={item.amount}
                  locale={locale}
                />
              ))}
            </ul>
          </details>
        ) : (
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {t('notConfigured')}
          </p>
        )}
      </StatCard>

      <StatCard
        label={t('variable')}
        value={calc.variableTotal}
        muted={calc.isProjection}
        placeholder={calc.isProjection ? t('noData') : undefined}
        locale={locale}
      >
        {!calc.isProjection && variableItems.length > 0 && (
          <details className="group mt-2">
            <summary className="cursor-pointer list-none text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]">
              {t('expandDetails', { count: variableItems.length })}
            </summary>
            <ul className="mt-2 flex flex-col gap-1">
              {variableItems.map((item) => (
                <Row
                  key={item.id}
                  label={translateCategory(item.category)}
                  value={item.amount}
                  locale={locale}
                />
              ))}
            </ul>
          </details>
        )}
      </StatCard>

      <StatCard label={t('totalSavings')} value={calc.totalSavings} locale={locale} />

      <StatCard label={t('etf')} value={calc.etfAmount} tone="success" locale={locale} />

      <StatCard
        label={t('extra')}
        value={calc.extraSavings}
        tone={calc.extraSavings >= 0 ? 'success' : 'danger'}
        emphasis
        locale={locale}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  tone?: 'success' | 'danger'
  emphasis?: boolean
  muted?: boolean
  placeholder?: string
  locale: Locale
  children?: React.ReactNode
}

function StatCard({
  label,
  value,
  tone,
  emphasis,
  muted,
  placeholder,
  locale,
  children,
}: StatCardProps) {
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </div>
      {placeholder ? (
        <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-text-tertiary)]">
          {placeholder}
        </div>
      ) : (
        <div
          className={cn(
            'mt-3 font-bold tabular-nums tracking-tight',
            emphasis ? 'text-4xl md:text-5xl' : 'text-3xl',
            tone === 'success' && 'text-[var(--color-success)]',
            tone === 'danger' && 'text-[var(--color-danger)]',
            !tone && 'text-[var(--color-text-primary)]',
            muted && 'text-[var(--color-text-tertiary)]'
          )}
        >
          {formatCurrency(value, locale)}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </Card>
  )
}

interface RowProps {
  label: string
  value: number
  locale: Locale
}

function Row({ label, value, locale }: RowProps) {
  return (
    <li className="flex items-center justify-between text-xs">
      <span className="text-[var(--color-text-secondary)]">{label}</span>
      <span className="font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatCurrency(value, locale)}
      </span>
    </li>
  )
}
