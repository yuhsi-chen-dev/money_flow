import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'neutral' | 'warning' | 'danger'
}

export function Badge({ variant = 'neutral', className, children, ...rest }: Props) {
  const variants: Record<NonNullable<Props['variant']>, string> = {
    success: 'bg-[var(--color-success-muted)] text-[var(--color-success)]',
    neutral: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
    warning: 'bg-[var(--color-bg-elevated)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-muted)] text-[var(--color-danger)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
