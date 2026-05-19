import { redirect } from '@/i18n/navigation'
import { getAuthUser } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params
  const user = await getAuthUser()

  if (user) {
    redirect({ href: '/dashboard', locale })
  }

  return <main>{children}</main>
}
