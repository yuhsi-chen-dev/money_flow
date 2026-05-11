import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const inputId = id ?? rest.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-xl border bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:outline-none focus:ring-2',
          error
            ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
            : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]',
          className
        )}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-[var(--color-danger)]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
      ) : null}
    </div>
  )
})
