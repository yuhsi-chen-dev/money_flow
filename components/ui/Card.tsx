import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { padding = 'md', hoverable, className, children, ...rest },
  ref
) {
  const paddings: Record<NonNullable<Props['padding']>, string> = {
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-200 ease-in-out',
        paddings[padding],
        hoverable && 'hover:scale-[1.01] hover:border-[var(--color-border-strong)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
})
