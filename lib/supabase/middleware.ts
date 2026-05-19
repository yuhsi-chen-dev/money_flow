import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const LOCALE_RE = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  for (const c of request.cookies.getAll()) {
    // @supabase/ssr writes cookies named `sb-<project-ref>-auth-token` (and split chunks like `…-auth-token.0`)
    if (c.name.startsWith('sb-') && c.name.includes('-auth-token')) {
      return true
    }
  }
  return false
}

export async function updateSession(
  request: NextRequest,
  baseResponse?: NextResponse
) {
  const response = baseResponse ?? NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // /api/* and /auth/* are never locale-prefixed — let them through, they handle auth themselves
  if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
    return response
  }

  const hasAuth = hasSupabaseAuthCookie(request)

  const localeMatch = pathname.match(LOCALE_RE)
  const locale = localeMatch?.[1] ?? routing.defaultLocale
  const localeless = localeMatch ? pathname.slice(localeMatch[0].length) || '/' : pathname
  const isLoginPath = localeless === '/login'

  if (!hasAuth && !isLoginPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (hasAuth && isLoginPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}
