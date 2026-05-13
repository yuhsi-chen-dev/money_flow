'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { useLocale, useTranslations } from 'next-intl'
import { formatCurrency, formatYM } from '@/lib/utils'
import type { HistoryMonth, Locale } from '@/types'

interface Props {
  months: HistoryMonth[]
}

interface ChartDatum {
  monthLabel: string
  ym: string
  hasRecord: boolean
  totalIncome: number
  totalFixed: number
  variableTotal: number
  totalSavings: number
  etfAmount: number
  extraSavings: number
}

function toChartData(months: HistoryMonth[], shortMonth: (m: number) => string): ChartDatum[] {
  return months.map(({ ym, calc }) => ({
    monthLabel: shortMonth(parseInt(ym.slice(5), 10)),
    ym,
    hasRecord: !calc.isProjection,
    totalIncome: calc.totalIncome,
    totalFixed: calc.totalFixed,
    variableTotal: calc.variableTotal,
    totalSavings: calc.totalSavings,
    etfAmount: calc.etfAmount,
    extraSavings: calc.extraSavings,
  }))
}

export function SavingsTrendChart({ months }: Props) {
  const t = useTranslations('history.chart')
  const tPreview = useTranslations('preview')
  const tCards = useTranslations('dashboard.cards')
  const locale = useLocale() as Locale

  const shortMonth = (m: number): string => {
    if (locale === 'en') {
      const date = new Date(2025, m - 1, 1)
      return date.toLocaleString('en-US', { month: 'short' })
    }
    return t('monthLabel', { month: m })
  }

  const data = toChartData(months, shortMonth)

  return (
    <div className="h-72 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
            tickFormatter={(value: number) =>
              value === 0 ? '0' : `${Math.round(value / 1000)}k`
            }
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-bg-hover)', opacity: 0.4 }}
            content={
              <ChartTooltip
                locale={locale}
                noRecordLabel={t('noRecord')}
                labels={{
                  income: tPreview('income'),
                  fixed: tPreview('fixed'),
                  variable: tPreview('variable'),
                  totalSavings: tCards('totalSavings'),
                  etf: tPreview('etf'),
                  extra: tPreview('extra'),
                }}
              />
            }
          />
          <Bar dataKey="extraSavings" radius={[6, 6, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.ym}
                fill={
                  !d.hasRecord
                    ? 'var(--color-text-disabled)'
                    : d.extraSavings >= 0
                      ? 'var(--color-success)'
                      : 'var(--color-danger)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps extends TooltipProps<number, string> {
  locale: Locale
  noRecordLabel: string
  labels: {
    income: string
    fixed: string
    variable: string
    totalSavings: string
    etf: string
    extra: string
  }
}

function ChartTooltip({
  active,
  payload,
  locale,
  noRecordLabel,
  labels,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as ChartDatum | undefined
  if (!d) return null

  return (
    <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-card)] px-4 py-3 text-xs shadow-xl backdrop-blur-xl">
      <div className="mb-2 font-semibold text-[var(--color-text-primary)]">
        {formatYM(d.ym, locale)}
      </div>
      {d.hasRecord ? (
        <dl className="flex flex-col gap-1">
          <Row label={labels.income} value={d.totalIncome} locale={locale} />
          <Row label={labels.fixed} value={-d.totalFixed} locale={locale} />
          <Row label={labels.variable} value={-d.variableTotal} locale={locale} />
          <Row label={labels.totalSavings} value={d.totalSavings} locale={locale} />
          <Row label={labels.etf} value={-d.etfAmount} locale={locale} />
          <div className="mt-1 border-t border-[var(--color-border)] pt-1">
            <Row label={labels.extra} value={d.extraSavings} locale={locale} bold />
          </div>
        </dl>
      ) : (
        <div className="text-[var(--color-text-tertiary)]">{noRecordLabel}</div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  locale,
  bold,
}: {
  label: string
  value: number
  locale: Locale
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd
        className={
          bold
            ? 'font-semibold tabular-nums text-[var(--color-text-primary)]'
            : 'tabular-nums text-[var(--color-text-primary)]'
        }
      >
        {formatCurrency(value, locale)}
      </dd>
    </div>
  )
}
