import { cn, formatCurrency } from '@/lib/utils'
import type { MonthCalculation } from '@/types'

interface Props {
  calc: MonthCalculation
}

export function LivePreview({ calc }: Props) {
  const positive = calc.extraSavings >= 0

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        即時預覽
      </div>

      <dl className="mt-5 flex flex-col gap-2.5 text-sm">
        <Row label="收入" value={calc.totalIncome} />
        <Row label="固定支出" value={-calc.totalFixed} />
        <Row label="浮動支出" value={-calc.variableTotal} />
        <Row label="ETF" value={-calc.etfAmount} />
      </dl>

      <div className="mt-6 border-t border-[var(--color-border)] pt-5">
        <div className="text-xs text-[var(--color-text-secondary)]">額外儲蓄</div>
        <div
          className={cn(
            'mt-1 font-display text-4xl font-bold tabular-nums tracking-tight',
            positive
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-danger)]'
          )}
        >
          {formatCurrency(calc.extraSavings)}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatCurrency(value)}
      </dd>
    </div>
  )
}
