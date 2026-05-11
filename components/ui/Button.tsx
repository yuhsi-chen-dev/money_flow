import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, children, ...rest },
  ref
) {
  const base =
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
    secondary:
      'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
    ghost:
      'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]',
    danger:
      'bg-[var(--color-danger)] text-white hover:opacity-90 active:scale-[0.98]',
  }

  const sizes: Record<NonNullable<Props['size']>, string> = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  )
})
