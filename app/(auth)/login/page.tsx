'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
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
      setError('登入失敗，請稍後再試')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl">
        MoneyFlow
      </h1>
      <p className="mt-4 text-base text-[var(--color-text-secondary)] md:text-lg">
        清楚知道這個月多存了多少
      </p>

      <div className="mt-16 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:items-center">
        <Button
          onClick={handleGoogleSignIn}
          size="lg"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? '正在前往 Google…' : '使用 Google 登入'}
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
