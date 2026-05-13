'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { Locale, VariableItem } from '@/types'

const DATALIST_ID = 'default-categories'

interface Props {
  items: VariableItem[]
  onChange: (items: VariableItem[]) => void
}

function parseIntSafe(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned === '') return 0
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

function newItem(): VariableItem {
  return { id: crypto.randomUUID(), category: '', amount: 0 }
}

export function CategoryList({ items, onChange }: Props) {
  const t = useTranslations('month.items')
  const tCat = useTranslations('categories')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale
  const itemsTotal = items.reduce((sum, i) => sum + i.amount, 0)

  function add() {
    onChange([...items, newItem()])
  }

  function updateCategory(id: string, category: string) {
    onChange(items.map((i) => (i.id === id ? { ...i, category } : i)))
  }

  function updateAmount(id: string, raw: string) {
    const amount = parseIntSafe(raw)
    onChange(items.map((i) => (i.id === id ? { ...i, amount } : i)))
  }

  function remove(id: string) {
    onChange(items.filter((i) => i.id !== id))
  }

  return (
    <div>
      <datalist id={DATALIST_ID}>
        {DEFAULT_CATEGORIES.map((c) => (
          <option key={c} value={c} label={tCat.has(c) ? tCat(c) : c} />
        ))}
      </datalist>

      {items.length === 0 ? (
        <p className="text-xs text-[var(--color-text-tertiary)]">
          {t('categoryEmpty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 md:items-center">
              <div className="flex-1">
                <Input
                  name={`category-${item.id}`}
                  list={DATALIST_ID}
                  placeholder={t('categoryPlaceholder')}
                  value={item.category}
                  onChange={(e) => updateCategory(item.id, e.target.value)}
                />
              </div>
              <div className="w-32 md:w-40">
                <Input
                  name={`amount-${item.id}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={item.amount === 0 ? '' : String(item.amount)}
                  onChange={(e) => updateAmount(item.id, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={tCommon('delete')}
                className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-all duration-200 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-danger)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <Button variant="secondary" size="sm" onClick={add}>
          {t('addCategory')}
        </Button>
        {items.length > 0 && (
          <span className="text-xs tabular-nums text-[var(--color-text-secondary)]">
            {t('totalLabel')}：
            <span className="ml-1 font-semibold text-[var(--color-text-primary)]">
              {formatCurrency(itemsTotal, locale)}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
