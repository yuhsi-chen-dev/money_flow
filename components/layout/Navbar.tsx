'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { LocaleToggle } from '@/components/layout/LocaleToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/history', label: t('history') },
    { href: '/welcome', label: t('philosophy') },
    { href: '/settings', label: t('settings') },
  ] as const

  async function handleSignOut() {
    setMenuOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-4 backdrop-blur-xl md:px-8">
        <Link
          href="/dashboard"
          className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
        >
          {tCommon('appName')}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
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
          <div className="ml-2 flex items-center gap-1">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full px-3 py-1.5 text-sm text-[var(--color-text-tertiary)] transition-all duration-200 hover:text-[var(--color-text-primary)]"
          >
            {t('signOut')}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t('openMenu')}
          aria-expanded={menuOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] md:hidden"
        >
          <HamburgerIcon />
        </button>
      </nav>

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-[var(--color-bg)]/95 backdrop-blur-xl transition-opacity duration-200 ease-out md:hidden',
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
          >
            {tCommon('appName')}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t('closeMenu')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between px-6 pb-10 pt-8">
          <ul className="flex flex-col gap-2">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'block rounded-2xl px-4 py-4 text-2xl font-semibold transition-all duration-200',
                      active
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-col items-stretch gap-4">
            <div className="flex items-center justify-center gap-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  )
}
