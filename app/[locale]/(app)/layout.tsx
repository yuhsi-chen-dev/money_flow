import { redirect } from '@/i18n/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ToastProvider } from '@/components/ui/Toast'
import { createServerClient } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: '/login', locale })
  }

  return (
    <ToastProvider>
      <Navbar />
      <main>{children}</main>
    </ToastProvider>
  )
}
