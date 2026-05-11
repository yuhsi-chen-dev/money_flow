import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function PageWrapper({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mx-auto min-h-screen w-full max-w-5xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-24',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
