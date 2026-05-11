import { Badge } from '@/components/ui/Badge'
import { cn, formatCurrency } from '@/lib/utils'

interface Props {
  extraSavings: number
  isProjection: boolean
}

export function SavingHero({ extraSavings, isProjection }: Props) {
  const positive = extraSavings >= 0

  return (
    <section className="flex flex-col items-center py-10 text-center md:py-16">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-secondary)]">
          本月額外儲蓄
        </span>
        <Badge variant={isProjection ? 'neutral' : 'success'}>
          {isProjection ? '預估中' : '已更新'}
        </Badge>
      </div>
      <div
        className={cn(
          'mt-4 font-display text-6xl font-bold tracking-tight tabular-nums md:text-8xl',
          positive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
        )}
      >
        {formatCurrency(extraSavings)}
      </div>
    </section>
  )
}
