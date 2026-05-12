import { Card } from '@/components/ui/Card'
import { cn, formatCurrency } from '@/lib/utils'
import type {
  FixedExpenseItem,
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
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatCard label="收入" value={calc.totalIncome}>
        <Row label="月薪" value={monthlyIncome} />
        {bonus > 0 && <Row label="獎金" value={bonus} />}
      </StatCard>

      <StatCard label="固定支出" value={calc.totalFixed}>
        {fixedExpenses.length > 0 ? (
          <details className="group mt-2">
            <summary className="cursor-pointer list-none text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]">
              展開明細 ({fixedExpenses.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-1">
              {fixedExpenses.map((item) => (
                <Row key={item.id} label={item.name || '—'} value={item.amount} />
              ))}
            </ul>
          </details>
        ) : (
          <p className="text-xs text-[var(--color-text-tertiary)]">尚未設定</p>
        )}
      </StatCard>

      <StatCard
        label="浮動支出"
        value={calc.variableTotal}
        muted={calc.isProjection}
        placeholder={calc.isProjection ? '尚未輸入' : undefined}
      >
        {!calc.isProjection && variableItems.length > 0 && (
          <details className="group mt-2">
            <summary className="cursor-pointer list-none text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]">
              展開明細 ({variableItems.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-1">
              {variableItems.map((item) => (
                <Row
                  key={item.id}
                  label={item.category || '—'}
                  value={item.amount}
                />
              ))}
            </ul>
          </details>
        )}
      </StatCard>

      <StatCard label="總儲蓄" value={calc.totalSavings} />

      <StatCard label="ETF 定期定額" value={calc.etfAmount} tone="success" />

      <StatCard
        label="額外儲蓄"
        value={calc.extraSavings}
        tone={calc.extraSavings >= 0 ? 'success' : 'danger'}
        emphasis
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
  children?: React.ReactNode
}

function StatCard({
  label,
  value,
  tone,
  emphasis,
  muted,
  placeholder,
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
          {formatCurrency(value)}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </Card>
  )
}

interface RowProps {
  label: string
  value: number
}

function Row({ label, value }: RowProps) {
  return (
    <li className="flex items-center justify-between text-xs">
      <span className="text-[var(--color-text-secondary)]">{label}</span>
      <span className="font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatCurrency(value)}
      </span>
    </li>
  )
}
