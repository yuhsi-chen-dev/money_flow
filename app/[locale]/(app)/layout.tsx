import { Navbar } from '@/components/layout/Navbar'
import { ToastProvider } from '@/components/ui/Toast'

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <ToastProvider>
      <Navbar />
      <main>{children}</main>
    </ToastProvider>
  )
}
