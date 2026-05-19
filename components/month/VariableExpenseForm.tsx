'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { CategoryList } from '@/components/month/CategoryList'
import { LivePreview } from '@/components/month/LivePreview'
import { useRouter } from '@/i18n/navigation'
import { useMonthlyRecordSave } from '@/hooks/useMonthlyRecord'
import { calculateMonth } from '@/lib/finance'
import { formatCurrency, formatYM } from '@/lib/utils'
import type { Locale, MonthlyRecord, UserSettings, VariableItem } from '@/types'

const NOTE_MAX = 200

interface Props {
  ym: string
  settings: UserSettings
  initialRecord: MonthlyRecord | null
}

function parseIntSafe(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned === '') return 0
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

function cloneTemplate(template: VariableItem[]): VariableItem[] {
  return template.map((i) => ({
    ...i,
    id: crypto.randomUUID(),
  }))
}

function sumItems(items: VariableItem[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0)
}

export function VariableExpenseForm({ ym, settings, initialRecord }: Props) {
  const t = useTranslations('month')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale
  const monthLabel = formatYM(ym, locale)
  const router = useRouter()
  const { toast } = useToast()
  const { save } = useMonthlyRecordSave(ym)

  const initialItems = useMemo<VariableItem[]>(() => {
    if (initialRecord) return initialRecord.variableItems
    if (settings.defaultVariableItems.length > 0) {
      return cloneTemplate(settings.defaultVariableItems)
    }
    return []
  }, [initialRecord, settings.defaultVariableItems])

  const initialItemsOpen =
    !!initialRecord
      ? initialRecord.variableItems.length > 0
      : settings.defaultVariableItems.length > 0

  const initialVariableTotal = (() => {
    if (initialRecord) return String(initialRecord.variableTotal)
    if (settings.defaultVariableItems.length > 0) {
      return String(sumItems(settings.defaultVariableItems))
    }
    return ''
  })()

  const [variableTotal, setVariableTotal] = useState(initialVariableTotal)
  const [bonus, setBonus] = useState(
    initialRecord && initialRecord.bonus > 0 ? String(initialRecord.bonus) : ''
  )
  const [bonusOpen, setBonusOpen] = useState(
    !!initialRecord && initialRecord.bonus > 0
  )
  const [note, setNote] = useState(initialRecord?.note ?? '')
  const [items, setItems] = useState<VariableItem[]>(initialItems)
  const [itemsOpen, setItemsOpen] = useState(initialItemsOpen)
  const [saving, setSaving] = useState(false)
  const [showRequiredError, setShowRequiredError] = useState(false)

  const itemsSum = sumItems(items)
  const effectiveTotal = itemsOpen ? itemsSum : parseIntSafe(variableTotal)
  const parsedBonus = bonusOpen ? parseIntSafe(bonus) : 0

  const previewRecord: MonthlyRecord = useMemo(
    () => ({
      id: 'preview',
      userId: 'preview',
      yearMonth: ym,
      bonus: parsedBonus,
      variableTotal: effectiveTotal,
      variableItems: [],
      createdAt: '',
      updatedAt: '',
    }),
    [ym, parsedBonus, effectiveTotal]
  )

  const calc = calculateMonth(settings, previewRecord)

  function closeItemsPanel() {
    setVariableTotal(itemsSum > 0 ? String(itemsSum) : '')
    setItems([])
    setItemsOpen(false)
  }

  async function handleSave() {
    if (saving) return
    if (!itemsOpen && variableTotal.trim() === '') {
      setShowRequiredError(true)
      toast(t('variable.requiredToast'), 'error')
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
        variableTotal: effectiveTotal,
        bonus: parsedBonus,
        variableItems: cleanedItems,
        note: note.trim() || undefined,
      })
      toast(t('saveSuccess'), 'success')
      router.push('/dashboard')
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : tCommon('saveError')
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(260px,340px)]">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <SectionHeader title={t('sections.income.title')} hint={t('sections.income.hint')} />

          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {t('salary.title')}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  {t('salary.hint')}
                </p>
              </div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-text-primary)]">
                {formatCurrency(settings.monthlyIncome, locale)}
              </div>
            </div>
          </Card>

          <Card>
            {bonusOpen ? (
              <>
                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {t('bonus.title')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setBonusOpen(false)
                      setBonus('')
                    }}
                    className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
                  >
                    {tCommon('remove')}
                  </button>
                </div>
                <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
                  {t('bonus.hint')}
                </p>
                <Input
                  name="bonus"
                  type="text"
                  inputMode="numeric"
                  placeholder={t('bonus.placeholder')}
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
                {t('bonus.addButton')}
              </Button>
            )}
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader title={t('sections.expense.title')} hint={t('sections.expense.hint')} />

          <Card>
            <h3 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
              {t('variable.title')}
            </h3>
            <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
              {itemsOpen
                ? t('variable.hintWithItems', { month: monthLabel })
                : t('variable.hintFreeform', { month: monthLabel })}
            </p>
            <Input
              name="variableTotal"
              type="text"
              inputMode="numeric"
              placeholder={t('variable.placeholder')}
              autoFocus={!itemsOpen}
              readOnly={itemsOpen}
              value={itemsOpen ? String(itemsSum) : variableTotal}
              onChange={(e) => {
                if (itemsOpen) return
                setVariableTotal(e.target.value)
                if (showRequiredError) setShowRequiredError(false)
              }}
              error={showRequiredError ? t('variable.requiredError') : undefined}
              hint={itemsOpen ? t('variable.readonlyHint') : undefined}
              className={itemsOpen ? 'cursor-not-allowed opacity-70' : undefined}
            />
          </Card>

          <Card>
            {itemsOpen ? (
              <>
                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {t('items.title')}
                  </h3>
                  <button
                    type="button"
                    onClick={closeItemsPanel}
                    className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
                  >
                    {tCommon('collapse')}
                  </button>
                </div>
                <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
                  {t('items.hint')}
                </p>
                <CategoryList items={items} onChange={setItems} />
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setItemsOpen(true)}
              >
                {t('items.addButton')}
              </Button>
            )}
          </Card>
        </section>

        <Card>
          <label
            htmlFor="note"
            className="mb-1 block text-lg font-semibold text-[var(--color-text-primary)]"
          >
            {t('note.title')}
          </label>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            {t('note.hint', { max: NOTE_MAX })}
          </p>
          <textarea
            id="note"
            name="note"
            maxLength={NOTE_MAX}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('note.placeholder')}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <div className="mt-1 text-right text-xs text-[var(--color-text-tertiary)] tabular-nums">
            {note.length} / {NOTE_MAX}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? tCommon('saving') : tCommon('save')}
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <LivePreview calc={calc} />
      </aside>
    </div>
  )
}

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col gap-1 px-1">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
        {title}
      </h2>
      <p className="text-xs text-[var(--color-text-tertiary)]">{hint}</p>
    </div>
  )
}
