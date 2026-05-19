# API Conventions

> Consult when: adding, editing, or reviewing anything under `app/api/**`.

## Response Shape (always consistent)
```typescript
// Success
{ data: T, error: null }

// Error
{ data: null, error: { message: string, code?: string } }
```

## Auth Guard (required at top of every API route)
```typescript
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabase = createServerClient()
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return NextResponse.json(
    { data: null, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
    { status: 401 }
  )
}
const userId = session.user.id  // use this for all DB queries
```

## Route Naming
```
GET  /api/settings              → fetch user settings
PUT  /api/settings              → update user settings

GET  /api/monthly-records       → list all records (for history)
POST /api/monthly-records       → create new record

GET    /api/monthly-records/[ym]  → get single record
PATCH  /api/monthly-records/[ym]  → update record
DELETE /api/monthly-records/[ym]  → delete record
```
