'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useSettings } from '@/hooks/useSettings'
import { calculateMonth, getTotalFixed } from '@/lib/finance'
import { ETF_AMOUNT } from '@/lib/constants'
import { cn, formatCurrency } from '@/lib/utils'
import type { FixedExpenseItem, UserSettings } from '@/types'

function parseIntSafe(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned === '') return 0
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

function newExpense(): FixedExpenseItem {
  return { id: crypto.randomUUID(), name: '', amount: 0 }
}

export default function SettingsPage() {
  const { settings, loading, error, save } = useSettings()
  const { toast } = useToast()

  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [etfAmount, setEtfAmount] = useState(String(ETF_AMOUNT))
  const [expenses, setExpenses] = useState<FixedExpenseItem[]>([])
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (loading || hydrated) return
    if (settings) {
      setMonthlyIncome(String(settings.monthlyIncome))
      setEtfAmount(String(settings.etfAmount))
      setExpenses(settings.fixedExpenses)
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
      createdAt: '',
      updatedAt: '',
    }),
    [parsedIncome, parsedEtf, expenses]
  )

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

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      const cleaned = expenses
        .map((e) => ({ ...e, name: e.name.trim() }))
        .filter((e) => e.name.length > 0)
      await save({
        monthlyIncome: parsedIncome,
        etfAmount: parsedEtf,
        fixedExpenses: cleaned,
      })
      setExpenses(cleaned)
      toast('設定已儲存 ✓', 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '儲存失敗，請再試一次'
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-tertiary)]">
          載入中…
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          設定
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          設定一次，每月只需更新浮動支出。
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-[var(--color-danger-muted)] bg-[var(--color-danger-muted)] px-4 py-3 text-sm text-[var(--color-danger)]">
          無法載入設定：{error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            收入
          </h2>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            每月固定到帳的薪資金額。
          </p>
          <Input
            label="月固定收入"
            name="monthlyIncome"
            type="text"
            inputMode="numeric"
            placeholder="例如 80000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            ETF 定期定額
          </h2>
          <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
            每月固定投資金額，從總儲蓄中扣除後才算額外儲蓄。
          </p>
          <Input
            label="每月固定投資金額"
            name="etfAmount"
            type="text"
            inputMode="numeric"
            value={etfAmount}
            onChange={(e) => setEtfAmount(e.target.value)}
          />
        </Card>

        <Card>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                固定支出
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                每月一定會發生的開銷，例如房租、訂閱、電信。
              </p>
            </div>
            <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
              合計：
              <span className="ml-1 font-semibold tabular-nums text-[var(--color-text-primary)]">
                {formatCurrency(totalFixed)}
              </span>
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-text-tertiary)]">
              還沒有任何固定支出。
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {expenses.map((item) => (
                <li key={item.id} className="flex items-start gap-2 md:items-center">
                  <div className="flex-1">
                    <Input
                      name={`name-${item.id}`}
                      placeholder="名稱（例如 房租）"
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
                    aria-label="刪除"
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
              ＋ 新增固定支出
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">
            預覽
          </h2>
          <p className="mb-6 text-xs text-[var(--color-text-tertiary)]">
            若本月沒有額外獎金，也沒有任何浮動支出。
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <PreviewStat label="收入" value={calc.totalIncome} />
            <PreviewStat label="固定支出" value={-calc.totalFixed} />
            <PreviewStat label="ETF" value={-calc.etfAmount} />
            <PreviewStat
              label="額外儲蓄"
              value={calc.extraSavings}
              emphasis
              tone={calc.extraSavings >= 0 ? 'success' : 'danger'}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '儲存中…' : '儲存'}
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
}

function PreviewStat({ label, value, emphasis, tone }: PreviewStatProps) {
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
        {formatCurrency(value)}
      </div>
    </div>
  )
}
