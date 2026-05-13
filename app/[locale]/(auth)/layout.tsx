import { redirect } from '@/i18n/navigation'
import { createServerClient } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

export default async function AuthLayout({ children, params }: Props) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect({ href: '/dashboard', locale: params.locale })
  }

  return <main>{children}</main>
}
