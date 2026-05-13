import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const numberLocale = (locale: Locale): string => (locale === 'en' ? 'en-US' : 'zh-TW')

export function formatCurrency(amount: number, locale: Locale = 'zh-TW'): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}NT$${Math.abs(amount).toLocaleString(numberLocale(locale))}`
}

export function formatYM(ym: string, locale: Locale = 'zh-TW'): string {
  const [year, month] = ym.split('-')
  const monthNum = parseInt(month ?? '0', 10)
  if (locale === 'en') {
    const date = new Date(Number(year), monthNum - 1, 1)
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  }
  return `${year}年${monthNum}月`
}

export function getCurrentYM(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function isValidYM(ym: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym)
}

export function shiftYM(ym: string, delta: number): string {
  const [yearStr, monthStr] = ym.split('-')
  const year = parseInt(yearStr ?? '0', 10)
  const month = parseInt(monthStr ?? '0', 10)
  const zeroIdx = year * 12 + (month - 1) + delta
  const newYear = Math.floor(zeroIdx / 12)
  const newMonth = (zeroIdx % 12) + 1
  return `${newYear}-${String(newMonth).padStart(2, '0')}`
}
