import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

type CookieToSet = { name: string; value: string; options: CookieOptions }

const LOCALE_RE = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

export async function updateSession(
  request: NextRequest,
  baseResponse?: NextResponse
) {
  let response = baseResponse ?? NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          const fresh = NextResponse.next({ request })
          if (baseResponse) {
            baseResponse.headers.forEach((value, key) => fresh.headers.set(key, value))
          }
          response = fresh
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // /api/* and /auth/* are never locale-prefixed — let them through, they handle auth themselves
  if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
    return response
  }

  const localeMatch = pathname.match(LOCALE_RE)
  const locale = localeMatch?.[1] ?? routing.defaultLocale
  const localeless = localeMatch ? pathname.slice(localeMatch[0].length) || '/' : pathname
  const isLoginPath = localeless === '/login'

  if (!user && !isLoginPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (user && isLoginPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}
