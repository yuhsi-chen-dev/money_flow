import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ToastProvider } from '@/components/ui/Toast'
import { createServerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <ToastProvider>
      <Navbar />
      <main>{children}</main>
    </ToastProvider>
  )
}
