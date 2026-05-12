import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Route } from 'next'
import { VariableExpenseForm } from '@/components/month/VariableExpenseForm'
import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  rowToSettings,
  type SettingsRow,
} from '@/lib/supabase/mappers'
import { createServerClient } from '@/lib/supabase/server'
import { formatYM, isValidYM } from '@/lib/utils'

interface PageProps {
  params: { ym: string }
}

export default async function MonthPage({ params }: PageProps) {
  if (!isValidYM(params.ym)) {
    notFound()
  }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settingsRow) {
    redirect('/settings?reason=onboard' as Route)
  }

  const settings = rowToSettings(settingsRow as SettingsRow)

  return (
    <PageWrapper>
      <header className="mb-10 flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="返回總覽"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
        >
          ←
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
            更新 {formatYM(params.ym)}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            記錄這個月的收入與支出，儲存後回到總覽。
          </p>
        </div>
      </header>

      <VariableExpenseForm ym={params.ym} settings={settings} />
    </PageWrapper>
  )
}
