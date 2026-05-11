'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { CategoryList } from '@/components/month/CategoryList'
import { LivePreview } from '@/components/month/LivePreview'
import { useMonthlyRecord } from '@/hooks/useMonthlyRecord'
import { calculateMonth } from '@/lib/finance'
import { formatYM } from '@/lib/utils'
import type { MonthlyRecord, UserSettings, VariableItem } from '@/types'

const NOTE_MAX = 200

interface Props {
  ym: string
  settings: UserSettings
}

function parseIntSafe(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned === '') return 0
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

export function VariableExpenseForm({ ym, settings }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const { record, loading, error, save } = useMonthlyRecord(ym)

  const [variableTotal, setVariableTotal] = useState('')
  const [bonus, setBonus] = useState('')
  const [bonusOpen, setBonusOpen] = useState(false)
  const [note, setNote] = useState('')
  const [items, setItems] = useState<VariableItem[]>([])
  const [itemsOpen, setItemsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showRequiredError, setShowRequiredError] = useState(false)

  useEffect(() => {
    if (loading || hydrated) return
    if (record) {
      setVariableTotal(String(record.variableTotal))
      setBonus(record.bonus > 0 ? String(record.bonus) : '')
      setBonusOpen(record.bonus > 0)
      setNote(record.note ?? '')
      setItems(record.variableItems)
      setItemsOpen(record.variableItems.length > 0)
    }
    setHydrated(true)
  }, [loading, record, hydrated])

  const parsedVariable = parseIntSafe(variableTotal)
  const parsedBonus = bonusOpen ? parseIntSafe(bonus) : 0

  const previewRecord: MonthlyRecord = useMemo(
    () => ({
      id: 'preview',
      userId: 'preview',
      yearMonth: ym,
      bonus: parsedBonus,
      variableTotal: parsedVariable,
      variableItems: [],
      createdAt: '',
      updatedAt: '',
    }),
    [ym, parsedBonus, parsedVariable]
  )

  const calc = calculateMonth(settings, previewRecord)

  async function handleSave() {
    if (saving) return
    if (variableTotal.trim() === '') {
      setShowRequiredError(true)
      toast('請輸入浮動支出', 'error')
      return
    }
    setSaving(true)
    try {
      const cleanedItems = itemsOpen
        ? items
            .map((i) => ({ ...i, category: i.category.trim() }))
            .filter((i) => i.category.length > 0)
        : []
      await save({
        variableTotal: parsedVariable,
        bonus: parsedBonus,
        variableItems: cleanedItems,
        note: note.trim() || undefined,
      })
      toast('已儲存 ✓', 'success')
      router.push('/dashboard')
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '儲存失敗，請再試一次'
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-tertiary)]">
        載入中…
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(260px,340px)]">
      <div className="flex flex-col gap-6">
        {error && (
          <div className="rounded-xl border border-[var(--color-danger-muted)] bg-[var(--color-danger-muted)] px-4 py-3 text-sm text-[var(--color-danger)]">
            無法載入紀錄：{error}
          </div>
        )}

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            浮動支出
          </h2>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            {formatYM(ym)} 的總花費（必填）。
          </p>
          <Input
            name="variableTotal"
            type="text"
            inputMode="numeric"
            placeholder="例如 12000"
            autoFocus
            value={variableTotal}
            onChange={(e) => {
              setVariableTotal(e.target.value)
              if (showRequiredError) setShowRequiredError(false)
            }}
            error={showRequiredError ? '請輸入金額' : undefined}
          />
        </Card>

        <Card>
          {bonusOpen ? (
            <>
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  獎金
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setBonusOpen(false)
                    setBonus('')
                  }}
                  className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
                >
                  移除
                </button>
              </div>
              <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
                這個月的一次性額外收入。
              </p>
              <Input
                name="bonus"
                type="text"
                inputMode="numeric"
                placeholder="例如 5000"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
              />
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBonusOpen(true)}
            >
              ＋ 新增獎金
            </Button>
          )}
        </Card>

        <Card>
          {itemsOpen ? (
            <>
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  分類明細
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setItemsOpen(false)
                    setItems([])
                  }}
                  className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
                >
                  收起
                </button>
              </div>
              <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
                記下花在哪些類別。總額仍以上方浮動支出為準。
              </p>
              <CategoryList
                items={items}
                expectedTotal={parsedVariable}
                onChange={setItems}
              />
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setItemsOpen(true)}
            >
              ＋ 新增分類明細
            </Button>
          )}
        </Card>

        <Card>
          <label
            htmlFor="note"
            className="mb-1 block text-lg font-semibold text-[var(--color-text-primary)]"
          >
            備註
          </label>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            選填，給自己看的提醒（最多 {NOTE_MAX} 字）。
          </p>
          <textarea
            id="note"
            name="note"
            maxLength={NOTE_MAX}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如 本月旅遊花費較多"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <div className="mt-1 text-right text-xs text-[var(--color-text-tertiary)] tabular-nums">
            {note.length} / {NOTE_MAX}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '儲存中…' : '儲存'}
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <LivePreview calc={calc} />
      </aside>
    </div>
  )
}
