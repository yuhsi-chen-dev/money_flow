import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}NT$${Math.abs(amount).toLocaleString('zh-TW')}`
}

export function formatYM(ym: string): string {
  const [year, month] = ym.split('-')
  return `${year}年${parseInt(month ?? '0', 10)}月`
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
