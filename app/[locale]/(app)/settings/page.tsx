'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useSettings } from '@/hooks/useSettings'
import { calculateMonth, getTotalFixed } from '@/lib/finance'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import { cn, formatCurrency } from '@/lib/utils'
import type { FixedExpenseItem, Locale, UserSettings, VariableItem } from '@/types'

const DEFAULT_VARIABLE_DATALIST_ID = 'settings-default-categories'

function parseIntSafe(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned === '') return 0
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

function newExpense(): FixedExpenseItem {
  return { id: crypto.randomUUID(), name: '', amount: 0 }
}

function newDefaultItem(): VariableItem {
  return { id: crypto.randomUUID(), category: '', amount: 0 }
}

export default function SettingsPage() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const tCat = useTranslations('categories')
  const locale = useLocale() as Locale
  const { settings, loading, error, save } = useSettings()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get('reason') === 'onboard'

  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [etfAmount, setEtfAmount] = useState('')
  const [expenses, setExpenses] = useState<FixedExpenseItem[]>([])
  const [defaultItems, setDefaultItems] = useState<VariableItem[]>([])
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (loading || hydrated) return
    if (settings) {
      setMonthlyIncome(String(settings.monthlyIncome))
      setEtfAmount(String(settings.etfAmount))
      setExpenses(settings.fixedExpenses)
      setDefaultItems(settings.defaultVariableItems)
    }
    setHydrated(true)
  }, [loading, settings, hydrated])

  const parsedIncome = parseIntSafe(monthlyIncome)
  const parsedEtf = parseIntSafe(etfAmount)

  const previewSettings: UserSettings = useMemo(
    () => ({
      id: 'preview',
      userId: 'preview',
      monthlyIncome: parsedIncome,
      etfAmount: parsedEtf,
      fixedExpenses: expenses,
      defaultVariableItems: defaultItems,
      createdAt: '',
      updatedAt: '',
    }),
    [parsedIncome, parsedEtf, expenses, defaultItems]
  )

  const defaultItemsTotal = defaultItems.reduce((sum, i) => sum + i.amount, 0)

  const calc = calculateMonth(previewSettings, null)
  const totalFixed = getTotalFixed(previewSettings)

  function addExpense() {
    setExpenses((prev) => [...prev, newExpense()])
  }

  function updateExpenseName(id: string, name: string) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)))
  }

  function updateExpenseAmount(id: string, raw: string) {
    const amount = parseIntSafe(raw)
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, amount } : e)))
  }

  function removeExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  function loadFixedStarters() {
    const names = (t.raw('fixed.starterNames') as unknown) as string[] | undefined
    if (!Array.isArray(names) || names.length === 0) return
    setExpenses(
      names.map((name) => ({
        id: crypto.randomUUID(),
        name,
        amount: 0,
      }))
    )
  }

  function addDefaultItem() {
    setDefaultItems((prev) => [...prev, newDefaultItem()])
  }

  function loadDefaultStarters() {
    const categories = (t.raw('defaults.starterCategories') as unknown) as
      | string[]
      | undefined
    if (!Array.isArray(categories) || categories.length === 0) return
    setDefaultItems(
      categories.map((category) => ({
        id: crypto.randomUUID(),
        category,
        amount: 0,
      }))
    )
  }

  function updateDefaultCategory(id: string, category: string) {
    setDefaultItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, category } : i))
    )
  }

  function updateDefaultAmount(id: string, raw: string) {
    const amount = parseIntSafe(raw)
    setDefaultItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, amount } : i))
    )
  }

  function removeDefaultItem(id: string) {
    setDefaultItems((prev) => prev.filter((i) => i.id !== id))
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      const cleanedExpenses = expenses
        .map((e) => ({ ...e, name: e.name.trim() }))
        .filter((e) => e.name.length > 0)
      const cleanedDefaults = defaultItems
        .map((i) => ({ ...i, category: i.category.trim() }))
        .filter((i) => i.category.length > 0)
      await save({
        monthlyIncome: parsedIncome,
        etfAmount: parsedEtf,
        fixedExpenses: cleanedExpenses,
        defaultVariableItems: cleanedDefaults,
      })
      setExpenses(cleanedExpenses)
      setDefaultItems(cleanedDefaults)
      toast(t('saveSuccess'), 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : tCommon('saveError')
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-tertiary)]">
          {tCommon('loading')}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t('subtitle')}
        </p>
      </header>

      {isOnboarding && !settings && (
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
          {t('onboardBanner')}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-[var(--color-danger-muted)] bg-[var(--color-danger-muted)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {t('loadError', { message: error })}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            {t('income.title')}
          </h2>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            {t('income.hint')}
          </p>
          <Input
            label={t('income.label')}
            name="monthlyIncome"
            type="text"
            inputMode="numeric"
            placeholder={t('income.placeholder')}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            {t('etf.title')}
          </h2>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            {t('etf.hint')}
          </p>
          <Input
            label={t('etf.label')}
            name="etfAmount"
            type="text"
            inputMode="numeric"
            placeholder={t('etf.placeholder')}
            value={etfAmount}
            onChange={(e) => setEtfAmount(e.target.value)}
          />
        </Card>

        <Card>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {t('fixed.title')}
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {t('fixed.hint')}
              </p>
            </div>
            <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
              {t('fixed.total')}：
              <span className="ml-1 font-semibold tabular-nums text-[var(--color-text-primary)]">
                {formatCurrency(totalFixed, locale)}
              </span>
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-text-tertiary)]">
              <span>{t('fixed.empty')}</span>
              <Button variant="secondary" size="sm" onClick={loadFixedStarters}>
                {t('fixed.loadStarters')}
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {expenses.map((item) => (
                <li key={item.id} className="flex items-start gap-2 md:items-center">
                  <div className="flex-1">
                    <Input
                      name={`name-${item.id}`}
                      placeholder={t('fixed.namePlaceholder')}
                      value={item.name}
                      onChange={(e) => updateExpenseName(item.id, e.target.value)}
                    />
                  </div>
                  <div className="w-32 md:w-40">
                    <Input
                      name={`amount-${item.id}`}
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={item.amount === 0 ? '' : String(item.amount)}
                      onChange={(e) => updateExpenseAmount(item.id, e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExpense(item.id)}
                    aria-label={tCommon('delete')}
                    className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-all duration-200 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-danger)]"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <Button variant="secondary" size="sm" onClick={addExpense}>
              {t('fixed.addButton')}
            </Button>
          </div>
        </Card>

        <Card>
          <datalist id={DEFAULT_VARIABLE_DATALIST_ID}>
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c} label={tCat.has(c) ? tCat(c) : c} />
            ))}
          </datalist>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {t('defaults.title')}
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {t('defaults.hint')}
              </p>
            </div>
            {defaultItems.length > 0 && (
              <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                {t('defaults.total')}：
                <span className="ml-1 font-semibold tabular-nums text-[var(--color-text-primary)]">
                  {formatCurrency(defaultItemsTotal, locale)}
                </span>
              </span>
            )}
          </div>

          {defaultItems.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-text-tertiary)]">
              <span>{t('defaults.empty')}</span>
              <Button variant="secondary" size="sm" onClick={loadDefaultStarters}>
                {t('defaults.loadStarters')}
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {defaultItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 md:items-center"
                >
                  <div className="flex-1">
                    <Input
                      name={`default-category-${item.id}`}
                      list={DEFAULT_VARIABLE_DATALIST_ID}
                      placeholder={t('defaults.categoryPlaceholder')}
                      value={item.category}
                      onChange={(e) =>
                        updateDefaultCategory(item.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32 md:w-40">
                    <Input
                      name={`default-amount-${item.id}`}
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={item.amount === 0 ? '' : String(item.amount)}
                      onChange={(e) =>
                        updateDefaultAmount(item.id, e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDefaultItem(item.id)}
                    aria-label={tCommon('delete')}
                    className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-all duration-200 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-danger)]"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <Button variant="secondary" size="sm" onClick={addDefaultItem}>
              {t('defaults.addButton')}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            {t('preview.title')}
          </h2>
          <p className="mb-6 text-xs text-[var(--color-text-tertiary)]">
            {t('preview.hint')}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <PreviewStat label={t('preview.income')} value={calc.totalIncome} locale={locale} />
            <PreviewStat label={t('preview.fixed')} value={-calc.totalFixed} locale={locale} />
            <PreviewStat label={t('preview.etf')} value={-calc.etfAmount} locale={locale} />
            <PreviewStat
              label={t('preview.extra')}
              value={calc.extraSavings}
              emphasis
              tone={calc.extraSavings >= 0 ? 'success' : 'danger'}
              locale={locale}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? tCommon('saving') : tCommon('save')}
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

interface PreviewStatProps {
  label: string
  value: number
  emphasis?: boolean
  tone?: 'success' | 'danger'
  locale: Locale
}

function PreviewStat({ label, value, emphasis, tone, locale }: PreviewStatProps) {
  return (
    <div>
      <div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
      <div
        className={cn(
          'mt-1 font-semibold tabular-nums tracking-tight',
          emphasis ? 'text-2xl md:text-3xl' : 'text-lg text-[var(--color-text-primary)]',
          tone === 'success' && 'text-[var(--color-success)]',
          tone === 'danger' && 'text-[var(--color-danger)]'
        )}
      >
        {formatCurrency(value, locale)}
      </div>
    </div>
  )
}
