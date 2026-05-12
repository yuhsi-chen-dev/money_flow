import Link from 'next/link'
import type { Route } from 'next'
import { cn, formatCurrency, formatYM } from '@/lib/utils'
import type { HistoryMonth } from '@/types'

interface Props {
  months: HistoryMonth[]
}

export function MonthTable({ months }: Props) {
  const sorted = [...months].sort((a, b) => (a.ym < b.ym ? 1 : -1))
  const hasAny = sorted.some((m) => !m.calc.isProjection)

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-16 text-center text-sm text-[var(--color-text-tertiary)]">
        這一年還沒有任何紀錄。回到總覽更新本月浮動支出，月底就會出現在這裡。
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">
            <Th className="text-left">月份</Th>
            <Th>收入</Th>
            <Th>固定支出</Th>
            <Th>浮動支出</Th>
            <Th>總儲蓄</Th>
            <Th>ETF</Th>
            <Th>額外儲蓄</Th>
            <Th className="text-right">操作</Th>
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
                  {formatYM(ym)}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalIncome) : '—'}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalFixed) : '—'}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.variableTotal) : '—'}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.totalSavings) : '—'}
                </Td>
                <Td muted={!recorded}>
                  {recorded ? formatCurrency(calc.etfAmount) : '—'}
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
                  {recorded ? formatCurrency(calc.extraSavings) : '—'}
                </Td>
                <Td className="text-right">
                  <Link
                    href={`/month/${ym}` as Route}
                    className="text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                  >
                    編輯
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
