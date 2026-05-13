import { type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API + OAuth callback: refresh session only, no locale rewriting
  if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
    return await updateSession(request)
  }

  // Locale routing — next-intl may redirect to add the prefix
  const intlResponse = intlMiddleware(request)

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  // After i18n the URL carries a locale prefix; layer session refresh on top
  return await updateSession(request, intlResponse)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
