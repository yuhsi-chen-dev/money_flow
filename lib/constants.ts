export const ETF_AMOUNT = 24000 as const

export const DEFAULT_CATEGORIES = [
  '食費',
  '交通',
  '娛樂',
  '購物',
  '醫療',
  '其他',
] as const

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number]
