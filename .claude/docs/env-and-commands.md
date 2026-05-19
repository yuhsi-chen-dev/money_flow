# Environment Variables & Commands

> Consult when: setting up a new machine, running scripts, or wondering "what's the pnpm command for…"

## Environment Variables

```bash
# .env.local — NEVER commit this file
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server-only — never use in client code
```

```bash
# .env.example — commit this as documentation
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Rule:** `SUPABASE_SERVICE_ROLE_KEY` is only usable in `app/api/**` routes.  
Any file in `app/(auth)/` or client components can only access `NEXT_PUBLIC_*` vars.

## Commands

```bash
# Development
pnpm dev                       # Start dev server at http://localhost:3000
pnpm build                     # Production build
pnpm start                     # Start production server locally

# Code quality
pnpm lint                      # ESLint check
pnpm lint:fix                  # Auto-fix lint errors
pnpm format                    # Prettier format all files
pnpm type-check                # tsc --noEmit — TypeScript check without build

# Testing
pnpm test                      # Run all Jest tests
pnpm test:watch                # Jest watch mode
pnpm test:coverage             # Jest with coverage report

# Supabase
pnpm supabase:start            # Start local Supabase (requires Docker)
pnpm supabase:stop             # Stop local Supabase
pnpm supabase:migration:new    # Create new SQL migration file
pnpm supabase:types            # Regenerate TypeScript types from live DB schema
```
