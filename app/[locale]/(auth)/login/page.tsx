'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const t = useTranslations('login')
  const tCommon = useTranslations('common')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (oauthError) {
      setError(t('googleError'))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl">
        {tCommon('appName')}
      </h1>
      <p className="mt-4 text-base text-[var(--color-text-secondary)] md:text-lg">
        {tCommon('tagline')}
      </p>

      <div className="mt-16 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:items-center">
        <Button
          onClick={handleGoogleSignIn}
          size="lg"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? t('googleLoading') : t('google')}
        </Button>

        {error && (
          <p className="text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
