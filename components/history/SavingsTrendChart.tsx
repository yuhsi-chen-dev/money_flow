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
import { formatCurrency, formatYM } from '@/lib/utils'
import type { HistoryMonth } from '@/types'

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

function toChartData(months: HistoryMonth[]): ChartDatum[] {
  return months.map(({ ym, calc }) => ({
    monthLabel: `${parseInt(ym.slice(5), 10)}月`,
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
  const data = toChartData(months)

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
            content={<ChartTooltip />}
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

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as ChartDatum | undefined
  if (!d) return null

  return (
    <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-card)] px-4 py-3 text-xs shadow-xl backdrop-blur-xl">
      <div className="mb-2 font-semibold text-[var(--color-text-primary)]">
        {formatYM(d.ym)}
      </div>
      {d.hasRecord ? (
        <dl className="flex flex-col gap-1">
          <Row label="收入" value={d.totalIncome} />
          <Row label="固定支出" value={-d.totalFixed} />
          <Row label="浮動支出" value={-d.variableTotal} />
          <Row label="總儲蓄" value={d.totalSavings} />
          <Row label="ETF" value={-d.etfAmount} />
          <div className="mt-1 border-t border-[var(--color-border)] pt-1">
            <Row label="額外儲蓄" value={d.extraSavings} bold />
          </div>
        </dl>
      ) : (
        <div className="text-[var(--color-text-tertiary)]">尚未紀錄</div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: number
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
        {formatCurrency(value)}
      </dd>
    </div>
  )
}
