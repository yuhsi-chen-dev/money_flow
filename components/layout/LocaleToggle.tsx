'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Locale } from '@/types'

const OTHER_LOCALE: Record<Locale, Locale> = {
  'zh-TW': 'en',
  en: 'zh-TW',
}

const LABEL: Record<Locale, string> = {
  'zh-TW': 'EN',
  en: '中',
}

export function LocaleToggle() {
  const t = useTranslations('nav.locale')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const target = OTHER_LOCALE[locale]

  function toggle() {
    const search = searchParams.toString()
    const fullPath = search ? `${pathname}?${search}` : pathname
    startTransition(() => {
      router.replace(fullPath, { locale: target })
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={t('switchTo')}
      title={t('switchTo')}
      className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
    >
      {LABEL[locale]}
    </button>
  )
}
