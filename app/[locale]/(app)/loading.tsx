import { PageWrapper } from '@/components/layout/PageWrapper'

export default function AppLoading() {
  return (
    <PageWrapper>
      <div className="animate-pulse">
        <div className="mb-10 space-y-3">
          <div className="h-10 w-48 rounded-md bg-[var(--color-bg-elevated)]" />
          <div className="h-4 w-72 rounded-md bg-[var(--color-bg-elevated)]" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-32 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]" />
          <div className="h-32 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]" />
          <div className="h-32 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]" />
        </div>
      </div>
    </PageWrapper>
  )
}
