'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/dashboard', label: '總覽' },
  { href: '/history', label: '歷史' },
  { href: '/settings', label: '設定' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 backdrop-blur-xl md:px-8">
      <Link
        href="/dashboard"
        className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
      >
        MoneyFlow
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm transition-all duration-200',
                active
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              )}
            >
              {label}
            </Link>
          )
        })}
        <button
          onClick={handleSignOut}
          className="ml-2 rounded-full px-3 py-1.5 text-sm text-[var(--color-text-tertiary)] transition-all duration-200 hover:text-[var(--color-text-primary)]"
        >
          登出
        </button>
      </div>
    </nav>
  )
}
