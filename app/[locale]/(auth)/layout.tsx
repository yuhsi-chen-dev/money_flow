import { redirect } from '@/i18n/navigation'
import { createServerClient } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect({ href: '/dashboard', locale })
  }

  return <main>{children}</main>
}
