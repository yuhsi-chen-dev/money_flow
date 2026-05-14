'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Theme = 'light' | 'dark'

const COOKIE = 'mf-theme'
const ONE_YEAR = 60 * 60 * 24 * 365
const LEGACY_STORAGE_KEY = 'mf-theme'

function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'light' ? 'light' : 'dark'
}

function writeCookie(theme: Theme) {
  document.cookie = `${COOKIE}=${theme}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`
}

function hasCookie() {
  return document.cookie.split('; ').some((p) => p.startsWith(`${COOKIE}=`))
}

export function ThemeToggle() {
  const t = useTranslations('nav.theme')
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(readCurrentTheme())

    // One-time migration: localStorage → cookie for users from the pre-cookie era.
    try {
      const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
      if ((legacy === 'light' || legacy === 'dark') && !hasCookie()) {
        writeCookie(legacy)
        document.documentElement.setAttribute('data-theme', legacy)
        setTheme(legacy)
      }
      if (legacy !== null) {
        window.localStorage.removeItem(LEGACY_STORAGE_KEY)
      }
    } catch {
      // localStorage may be unavailable (private mode, etc.) — ignore.
    }
  }, [])

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    writeCookie(next)
    setTheme(next)
  }

  const showSun = theme === 'light'
  const label =
    theme === null
      ? t('default')
      : showSun
        ? t('toDark')
        : t('toLight')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
    >
      {theme === null ? (
        <span className="block h-4 w-4" aria-hidden />
      ) : showSun ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.06 1.06M17.34 17.34l1.06 1.06M5.6 18.4l1.06-1.06M17.34 6.66l1.06-1.06" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  )
}
