'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = crypto.randomUUID()
    setItems((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto rounded-full border px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-200',
              t.variant === 'success' &&
                'border-[var(--color-success-muted)] bg-[var(--color-success-muted)] text-[var(--color-success)]',
              t.variant === 'error' &&
                'border-[var(--color-danger-muted)] bg-[var(--color-danger-muted)] text-[var(--color-danger)]',
              t.variant === 'info' &&
                'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
