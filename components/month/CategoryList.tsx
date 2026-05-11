'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { VariableItem } from '@/types'

const DATALIST_ID = 'default-categories'

interface Props {
  items: VariableItem[]
  expectedTotal: number
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

export function CategoryList({ items, expectedTotal, onChange }: Props) {
  const itemsTotal = items.reduce((sum, i) => sum + i.amount, 0)
  const mismatch = items.length > 0 && itemsTotal !== expectedTotal

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
          <option key={c} value={c} />
        ))}
      </datalist>

      {items.length === 0 ? (
        <p className="text-xs text-[var(--color-text-tertiary)]">
          選填，分類加總應等於浮動支出總額。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 md:items-center">
              <div className="flex-1">
                <Input
                  name={`category-${item.id}`}
                  list={DATALIST_ID}
                  placeholder="分類（食費 / 交通 …）"
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
                aria-label="刪除"
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
          ＋ 新增分類
        </Button>
        {items.length > 0 && (
          <span className="text-xs tabular-nums text-[var(--color-text-secondary)]">
            分類合計：
            <span className="ml-1 font-semibold text-[var(--color-text-primary)]">
              {formatCurrency(itemsTotal)}
            </span>
            {mismatch && (
              <span className="ml-2 text-[var(--color-warning)]">
                與浮動支出總額不符
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
