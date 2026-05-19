# Pages Spec & Edge Cases

> Consult when: building or modifying any page under `app/[locale]/...`, or hunting down the expected behavior for a specific scenario.

## `/login` — 登入
- Full-page centered layout, **no Navbar**
- App name "MoneyFlow" in large display font (`text-4xl font-bold`)
- Tagline: `清楚知道這個月多存了多少` — single line below name
- Single CTA: "使用 Google 登入" — full-width on mobile, auto-width on desktop
- Apple aesthetic: black background, pure white text, maximum whitespace
- On auth success → redirect to `/dashboard`
- If already authenticated → redirect immediately to `/dashboard`

## `/welcome` — 第一次登入導覽 + 理念回顧 (dual-mode)
- Auth-required: if no session → redirect to `/login`
- Determines `hasSettings` from a single Supabase query at the top of the page — never redirects on this signal; it controls rendering instead
- Header: large "MoneyFlow" wordmark + tagline 「清楚知道這個月多存了多少」
- Three Apple-minimal cards stacked vertically (`max-w-4xl mx-auto`, generous spacing), wrapped in `<Reveal>` for the scroll cascade:
  1. **一個公式，搞懂一切** — `儲蓄 = 收入 − 固定支出 − 浮動支出`. Subtitle: "靈感來自尼克．馬朱利《持續買進》。重點不在花了多少，而在剩下多少。"
  2. **不是另一個分類記帳 app** — "不要求你每天輸入每一筆消費。一個月只要在月底花 30 秒，輸入這個月的浮動支出總額即可。"
  3. **你真正多存了多少** — "ETF 定期定額是『pay yourself first』— 強制儲蓄不能少。扣掉固定支出、浮動支出、ETF 之後，剩下的就是『額外儲蓄』— 這個 app 唯一在乎的數字。"

**Onboarding mode** (`hasSettings === false`)
- **No Navbar** — focused funnel
- Floating `LocaleToggle` pinned top-right
- CTA: 「開始設定 →」 → `/settings`

**Review mode** (`hasSettings === true`)
- `Navbar` renders at the top (its 理念/Philosophy entry highlights as active); `LocaleToggle` lives in the Navbar so no floating one is needed
- Main top padding shifts to `pt-20 md:pt-28` so the hero clears the fixed nav
- CTA: 「返回總覽 →」 → `/dashboard`

All strings live under `welcome.*` in `messages/{locale}.json` (CTA copy is `welcome.cta` for onboarding, `welcome.ctaBack` for review).

## `/dashboard` — 當月總覽
- Auto-detects current month via `getCurrentYM()`
- **Guard:** If no `user_settings` → redirect to `/settings` with info banner "請先完成設定"
- **Hero section:**
  - Label: "本月額外儲蓄" + badge ("已更新" or "預估中")
  - Number: `text-6xl md:text-8xl font-bold tabular-nums`
  - Color: `--color-success` if ≥ 0, `--color-danger` if < 0
- **Formula cards grid** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`):
  1. 收入 — `monthlyIncome` + bonus line if `bonus > 0`
  2. 固定支出 — `totalFixed` with a `<details>` 展開明細 list of all items
  3. 浮動支出 — `variableTotal` or "尚未輸入" if projection; when `record.variableItems` is non-empty, render the same `<details>` 展開明細 list (category + amount per row)
  4. 總儲蓄 — `totalSavings`
  5. ETF 定期定額 — `etfAmount`, always `--color-success`
  6. 額外儲蓄 — `extraSavings`, color-coded, larger than other cards
- **CTA:** "更新本月浮動支出" primary button → `/month/YYYY-MM`
- **Month selector:** ← prev month / current month label / next month →

## `/month/[ym]` — 月底更新
- Validate `ym` with `isValidYM()` — 404 if invalid format
- Header: `更新 {formatYM(ym)}` with back arrow → `/dashboard`
- The form is grouped into **two labeled sections** so the page reads as "月底更新", not "浮動支出 only":

  **本月收入** (section heading)
  - 月薪 — read-only display of `settings.monthlyIncome` (formatted), captioned "於設定頁調整"
  - 獎金 — optional, collapsed by default behind "＋ 新增獎金" toggle; when open, shows a number input + 移除 link. Caption: "這個月的一次性額外收入"

  **本月支出** (section heading)
  - 浮動支出 total — required number input, autofocus on mount when breakdown is closed
  - 分類明細 — optional, behind "＋ 新增分類明細" toggle. Auto-opens (and seeds rows) if `settings.defaultVariableItems` is non-empty and no record exists yet for this month.
    - Add item: select from `DEFAULT_CATEGORIES` or type custom name + amount
    - Remove items with × button
    - **While the breakdown panel is open, `variableTotal` is read-only and equals the sum of items.** Closing the panel returns to freeform editing of the total.

- **Note** — optional textarea, max 200 chars (rendered after both sections)
- **Live preview panel** — sticky on desktop right column, below form on mobile:
  - All formula values update as user types (no submit needed)
  - 額外儲蓄 preview in large colored text
- **Save button** → PATCH `/api/monthly-records/[ym]`
- On success → Toast "已儲存 ✓" then redirect to `/dashboard`
- Allow editing past months — no lock or restriction

## `/history` — 歷史趨勢
- Page title: "歷史趨勢"
- **Year selector** — defaults to current year, navigable
- **recharts BarChart:**
  - X-axis: Jan–Dec (show all 12 months, empty = 0 height)
  - Y-axis: NT$ amount (formatted with `formatCurrency`)
  - Bar: `--color-success` if extraSavings ≥ 0, `--color-danger` if < 0
  - Tooltip: show all MonthCalculation values on hover
  - Empty months: 0 height bar, muted color
- **Yearly summary cards** (`grid-cols-2 md:grid-cols-4`):
  1. 年度額外儲蓄合計
  2. 月平均額外儲蓄
  3. 最佳月份 (max extraSavings)
  4. 最差月份 (min extraSavings)
- **Month table** (sorted newest first):
  - Columns: 月份 / 收入 / 固定支出 / 浮動支出 / 總儲蓄 / ETF / 額外儲蓄 / 操作
  - "編輯" link per row → `/month/[ym]`
  - Empty state message if no records

## `/settings` — 設定
- Page title: "設定"
- **月固定收入** — required number input
- **ETF 定期定額** — number input (empty by default — first-time users consciously enter their own amount; the DB still defaults the column to 24000)
- **固定支出清單:**
  - List of items: each row has name input + amount input + delete button
  - Inline editing (no separate modal)
  - "＋ 新增固定支出" button appends a new empty row
  - **Empty state**: shows 「還沒有任何固定支出」 + a 「套用範本」 button. Clicking it appends 5 starter rows (locale-aware names: zh `房租/電信/網路/水電/訂閱`, en `Rent/Mobile/Internet/Utilities/Subscriptions`), each with amount `0` and a fresh `crypto.randomUUID()`. Starter names live in `messages/{locale}.json` under `settings.fixed.starterNames` (array). Button hides once any row exists.
  - Running total shown below: "固定支出合計：NT$XX,XXX"
- **預設浮動支出範本** — optional template that seeds `/month/[ym]`:
  - List of items: category input (with datalist of `DEFAULT_CATEGORIES`) + amount input + × delete
  - "＋ 新增分類" button appends an empty row
  - **Empty state**: shows 「還沒有範本」 + a 「套用範本」 button. Clicking it appends one row per entry in the active locale's starter list (zh: `食費 / 交通 / 娛樂 / 購物 / 醫療 / 其他`; en: `Food / Transport / Entertainment / Shopping / Medical / Other`) with amount `0`. Starter labels live in `messages/{locale}.json` under `settings.defaults.starterCategories`. The label is persisted verbatim — loading starters in English saves English category strings; loading in Chinese saves the canonical zh keys. The datalist further offers the canonical zh keys (with translated display labels) for autocomplete on any manually-added row.
  - Running total shown below: "範本合計：NT$XX,XXX"
  - Empty list = feature inactive; month form keeps its current freeform behavior
- **Preview** — shows projected 額外儲蓄 assuming no 浮動支出 and no bonus
- **儲存** → PUT `/api/settings`
- On success → Toast "設定已儲存 ✓"

---

## Edge Cases

| Situation | Expected Behavior |
|---|---|
| First login, no settings | Redirect to `/welcome` (intro screen); CTA there leads to `/settings` |
| Visit `/welcome` after onboarding (settings exist) | Renders the same three cards in review mode — Navbar at the top, CTA flips to 「返回總覽 →」 → `/dashboard`. Reachable anytime via the Navbar's 理念/Philosophy entry. |
| Dashboard with no record for current month | Show projection with "預估中" badge, variableTotal = 0 |
| Months with no record in history | Empty bar in chart (height 0), "—" in table cells |
| Negative 額外儲蓄 | Red color, no error — perfectly valid |
| bonus = 0 | Don't render bonus line in formula cards |
| variableItems sum ≠ variableTotal | While breakdown panel is open, the total is locked to the sum; closing the panel re-enables freeform total entry. Legacy records with mismatched totals get reconciled to the sum on next save. |
| First time opening a month with `defaultVariableItems` configured and no existing record | Breakdown panel auto-opens, items pre-seeded from template, total auto-set to sum |
| `defaultVariableItems` configured but record already exists for the month | Load saved `variableItems` (template is ignored — record is authoritative) |
| Navigate to a future month | Allowed — useful for planning |
| ETF amount > totalSavings | extraSavings is negative, shown in red |
| Edit a past month | Allowed — no restrictions on past dates |
| Delete a monthly record | Allowed via DELETE API — confirm before action |
| Visit a path without a locale prefix (e.g. `/dashboard`) | Middleware always redirects to the default-locale prefix (`/en/dashboard`); `localeDetection: false` so browser `Accept-Language` and the `NEXT_LOCALE` cookie are ignored — only the `LocaleToggle` switches locale |
| Visit an unsupported locale (e.g. `/fr/dashboard`) | 404 — `next-intl` allowlist rejects it |
| Switch locale mid-edit on `/month/[ym]` | Form state preserved (locale toggle is `router.replace`, not a remount) |
| Historical `variable_items.category` stored in zh while UI is in `en` | Render verbatim — stored strings are never auto-translated |
