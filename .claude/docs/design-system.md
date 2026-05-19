# Design System — Apple-Inspired Minimalism

> Consult when: building or restyling any UI component, page, or layout.

## Philosophy
- **Clean, spacious, confident** — think apple.com, not a SaaS dashboard
- Large typography. Generous whitespace. Razor-sharp contrast.
- Dark mode is primary. Light mode is secondary.
- Every pixel intentional. Zero decorative flourishes.
- Micro-interactions: subtle and purposeful, never flashy.

## Typography
```css
--font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
--font-body:    'SF Pro Text',    -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
--font-mono:    'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
```
Font stack always ends with `-apple-system, BlinkMacSystemFont, sans-serif`.  
Never use Inter, Roboto, or Arial.

## Color Palette — Full CSS Variables

Define entirely in `app/globals.css`:

```css
:root {
  /* Backgrounds */
  --color-bg:             #000000;
  --color-bg-elevated:    #111111;
  --color-bg-card:        #1c1c1e;
  --color-bg-hover:       #2c2c2e;

  /* Borders */
  --color-border:         rgba(255, 255, 255, 0.08);
  --color-border-strong:  rgba(255, 255, 255, 0.16);

  /* Text */
  --color-text-primary:   #f5f5f7;
  --color-text-secondary: #a1a1a6;
  --color-text-tertiary:  #6e6e73;
  --color-text-disabled:  #3a3a3c;

  /* Accents */
  --color-accent:         #2997ff;
  --color-accent-hover:   #0077ed;
  --color-success:        #30d158;
  --color-success-muted:  rgba(48, 209, 88, 0.12);
  --color-warning:        #ffd60a;
  --color-danger:         #ff453a;
  --color-danger-muted:   rgba(255, 69, 58, 0.12);
}

/* Light mode overrides */
@media (prefers-color-scheme: light) {
  :root {
    --color-bg:             #ffffff;
    --color-bg-elevated:    #f5f5f7;
    --color-bg-card:        #ffffff;
    --color-bg-hover:       #e8e8ed;
    --color-border:         rgba(0, 0, 0, 0.08);
    --color-border-strong:  rgba(0, 0, 0, 0.16);
    --color-text-primary:   #1d1d1f;
    --color-text-secondary: #6e6e73;
    --color-text-tertiary:  #aeaeb2;
    --color-text-disabled:  #d1d1d6;
    --color-accent:         #0071e3;
    --color-accent-hover:   #0077ed;
    --color-success:        #1c7c2e;
    --color-success-muted:  rgba(28, 124, 46, 0.08);
    --color-warning:        #b38600;
    --color-danger:         #d70015;
    --color-danger-muted:   rgba(215, 0, 21, 0.08);
  }
}
```

## Spacing & Layout
- Page horizontal padding: `px-4 md:px-8`
- Section vertical padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Grid gaps: `gap-4`, `gap-6`, `gap-8`
- **Max content width: `max-w-5xl mx-auto`**
- **Mobile-first RWD**: `sm:640px` · `md:768px` · `lg:1024px`

## Component Patterns

**Cards:**
```
rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6
```

**Primary Button:**
```
bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
text-white rounded-full px-6 py-2.5 font-medium text-sm
transition-all duration-200 ease-in-out
```

**Secondary Button:**
```
bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)]
text-[var(--color-text-primary)] rounded-full px-6 py-2.5 font-medium text-sm
transition-all duration-200 ease-in-out
```

**Hero Number (額外儲蓄):**
```
text-5xl md:text-7xl font-bold tabular-nums tracking-tight
— positive: text-[var(--color-success)]
— negative: text-[var(--color-danger)]
```

**Text Input:**
```
w-full rounded-xl border border-[var(--color-border)]
bg-[var(--color-bg-elevated)] px-4 py-3 text-sm
text-[var(--color-text-primary)]
placeholder:text-[var(--color-text-tertiary)]
focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
transition-all duration-200
```

**Navbar:**
```
fixed top-0 inset-x-0 z-50
bg-[var(--color-bg)]/80 backdrop-blur-xl
border-b border-[var(--color-border)]
h-14 flex items-center justify-between px-4 md:px-8
```

**Badge:**
```
— "已更新": bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-full px-3 py-1 text-xs font-medium
— "預估中": bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] rounded-full px-3 py-1 text-xs font-medium
```

## Rules
- No drop shadows — use border + background contrast
- Hover: `hover:scale-[1.01]` or `hover:bg-[var(--color-bg-hover)]` — never color explosion
- All transitions: `transition-all duration-200 ease-in-out`
- Grid for dashboard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Flexbox for components: `flex items-center gap-3`
