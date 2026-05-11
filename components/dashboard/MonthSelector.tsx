import Link from 'next/link'
import { formatYM, shiftYM } from '@/lib/utils'

interface Props {
  ym: string
}

export function MonthSelector({ ym }: Props) {
  const prev = shiftYM(ym, -1)
  const next = shiftYM(ym, 1)

  return (
    <nav
      aria-label="月份切換"
      className="flex items-center justify-center gap-4"
    >
      <Link
        href={{ pathname: '/dashboard', query: { ym: prev } }}
        aria-label={`前一個月：${formatYM(prev)}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        ←
      </Link>
      <span className="min-w-[8ch] text-center text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
        {formatYM(ym)}
      </span>
      <Link
        href={{ pathname: '/dashboard', query: { ym: next } }}
        aria-label={`下一個月：${formatYM(next)}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
      >
        →
      </Link>
    </nav>
  )
}
