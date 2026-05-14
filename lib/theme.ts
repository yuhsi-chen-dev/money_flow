import { cookies } from 'next/headers'

export type Theme = 'light' | 'dark'

export const THEME_COOKIE = 'mf-theme'
export const DEFAULT_THEME: Theme = 'dark'

export async function readTheme(): Promise<Theme> {
  const cookieStore = await cookies()
  const value = cookieStore.get(THEME_COOKIE)?.value
  return value === 'light' || value === 'dark' ? value : DEFAULT_THEME
}
