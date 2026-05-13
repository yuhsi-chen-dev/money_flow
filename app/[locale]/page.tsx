import { redirect } from '@/i18n/navigation'

interface Props {
  params: { locale: string }
}

export default function LocaleRootPage({ params }: Props) {
  redirect({ href: '/dashboard', locale: params.locale })
}
