# Agent.md

## Quick Reference

| Stack | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5+ (strict) |
| Package Manager | pnpm |
| CMS | Google Sheets (server-side only) |
| Checkout | WhatsApp redirect |
| Validation | Zod |
| Testing | Vitest + React Testing Library |

---

## Architecture

**Pattern**: Vertical Slice Architecture + Server Components First

### Directory Structure

```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # Home page
├── loading.tsx             # Global loading UI
├── error.tsx               # Global error boundary
├── not-found.tsx           # Global 404
├── proxy.ts                # Next.js 16 middleware (was middleware.ts)
├── sitemap.ts              # SEO sitemap generation
├── (store)/                # Route group — no URL impact
│   ├── page.tsx            # Store home
│   ├── menu/
│   │   └── [slug]/
│   │       └── page.tsx    # Product detail
│   └── checkout/
│       └── page.tsx
├── actions/
│   ├── cart.ts             # Cart Server Actions
│   └── order.ts            # Order Server Actions
└── api/                    # Route Handlers (only if needed)

features/
├── products/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── utils/
├── cart/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── checkout/
│   ├── actions/
│   ├── components/
│   └── validation/
└── categories/
    ├── components/
    └── services/

components/
├── ui/                     # Primitives (Button, Input, Card)
├── layout/                 # Header, Footer, Container
└── shared/                 # Cross-feature components

lib/
├── google-sheets/          # Sheets API client
├── whatsapp/               # Message builder
├── cache/                  # Cache utilities
└── env/                    # Validated env vars

types/                      # Shared domain types
config/                     # Constants, site config
public/                     # Static assets
```

### Principles

1. **Server First** — default to Server Components, add `'use client'` only when needed
2. **Feature-oriented** — group by domain, not by technical layer
3. **Minimal client JS** — every `'use client'` is a conscious decision
4. **Type safety** — Zod schemas at boundaries, TypeScript everywhere else

---

## Next.js 16 Rules

### Async APIs (BREAKING CHANGE from v14)

`params`, `searchParams`, `cookies()`, and `headers()` are now **async**. Always `await` them.

```typescript
// Pages and Layouts
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}

// Route Handlers
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
}

// SearchParams
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ query?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { query } = await searchParams
}

// Cookies and Headers
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const headersList = await headers()
}
```

### Middleware → Proxy (v16 rename)

```typescript
// proxy.ts (root of project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ['/api/:path*'],
}
```

### Directives

| Directive | Purpose | When to use |
|-----------|---------|-------------|
| `'use client'` | Client Component | State, browser APIs, event handlers |
| `'use server'` | Server Action | Mutations, form handling |
| `'use cache'` | Cache Component | Data that rarely changes (requires config) |

### Data Fetching Decision Tree

```
Need data?
├── Server Component (read)?
│   └── Fetch directly — no API needed
├── Client Component (mutation)?
│   └── Server Action
├── Client Component (read)?
│   └── Pass from Server Component OR Route Handler
├── External API / webhook?
│   └── Route Handler
└── Mobile app / external client?
    └── Route Handler
```

**Rule**: Never fetch from a Route Handler when a Server Component can do it directly.

### Avoiding Data Waterfalls

```typescript
// BAD: Sequential
const user = await getUser()      // Wait
const posts = await getPosts()    // Then wait
const comments = await getComments() // Then wait

// GOOD: Parallel
const [user, posts, comments] = await Promise.all([
  getUser(),
  getPosts(),
  getComments(),
])

// GOOD: Streaming with Suspense
<Suspense fallback={<UserSkeleton />}>
  <UserSection />
</Suspense>
<Suspense fallback={<PostsSkeleton />}>
  <PostsSection />
</Suspense>
```

### Error Handling

Every route segment should have:

| File | Purpose |
|------|---------|
| `error.tsx` | Catches errors (must be `'use client'`) |
| `not-found.tsx` | 404 UI |
| `loading.tsx` | Loading skeleton |

**Critical**: Do NOT wrap `redirect()`, `notFound()`, `forbidden()`, or `unauthorized()` in try-catch. They throw special errors Next.js handles internally.

```typescript
// BAD
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`) // This throws!
  } catch (error) {
    // redirect() is caught here — navigation fails!
    return { error: 'Failed' }
  }
}

// GOOD
async function createPost(formData: FormData) {
  let post
  try {
    post = await db.post.create({ ... })
  } catch (error) {
    return { error: 'Failed' }
  }
  redirect(`/posts/${post.id}`) // Outside try-catch
}
```

### Server Actions Contract

Every Server Action must:

```typescript
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const OrderSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().regex(/^\+?\d{10,15}$/),
  address: z.string().min(5).max(200),
  notes: z.string().max(500).optional(),
})

export async function submitOrder(formData: FormData) {
  // 1. Validate
  const result = OrderSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // 2. Sanitize
  const data = {
    ...result.data,
    name: result.data.name.trim(),
    address: result.data.address.trim(),
  }

  // 3. Process
  try {
    await saveOrder(data)
  } catch (error) {
    return { error: 'Failed to save order' }
  }

  // 4. Revalidate (outside try-catch)
  revalidatePath('/orders')
}
```

---

## TypeScript Rules

- **Strict mode** enabled
- **Never** use `any` — prefer `unknown`
- Use `type` by default, `interface` only when extension is needed
- Explicit types for: `Product`, `Category`, `CartItem`, `Order`, `Env`

```typescript
// Domain types
type Product = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  image: string
  available: boolean
}

type CartItem = {
  product: Product
  quantity: number
}

// Env validation (lib/env.ts)
import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_SHEET_ID: z.string().min(1),
  WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_PRIVATE_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
```

---

## Security Rules

### Environment Variables

- Validate on startup with Zod
- Never access `process.env` directly in components
- Use centralized `lib/env.ts` module
- Never commit `.env`

### Input Validation

- Validate **every** user input with Zod
- Sanitize strings (`.trim()`)
- Never trust `FormData` — always parse through Zod

### XSS Protection

- Never use `dangerouslySetInnerHTML` unless absolutely necessary
- If required, sanitize first

### Rate Limiting

Protect checkout submissions. Recommended: Upstash Rate Limit.

---

## React 19 Rules

- **Server Components** by default
- Add `'use client'` only when:
  - State is required (`useState`, `useReducer`)
  - Browser APIs are needed (`window`, `localStorage`)
  - Event handlers require hydration
- Keep `'use client'` boundaries as low as possible in the tree

---

## Google Sheets Integration

- Products fetched **server-side only**
- Never expose Google credentials to the browser
- Implement cache layer + revalidation strategy
- Error handling with fallback UI

---

## Testing

**Runner**: Vitest + React Testing Library

```bash
pnpm test          # Run once
pnpm test:watch    # Watch mode
```

**Structure**: `src/utils/__tests__/cart.test.ts` (co-locate tests with source)

**Rules**:
- Test behavior, not implementation
- Use `describe` for grouping, `it` for individual cases
- Test edge cases: empty arrays, missing data, invalid input
- No `console.log` in tests

---

## Accessibility (WCAG 2.2 AA)

- All images: `alt` text
- Forms: labels associated with inputs
- Buttons: accessible names
- Keyboard navigation required
- Visible focus states
- Color contrast: minimum 4.5:1
- Semantic HTML: `header`, `main`, `nav`, `section`, `article`, `footer`
- Prefer native HTML before ARIA

---

## SEO

- Every page: `title`, `description`, `canonical` via `generateMetadata()`
- Generate `sitemap.xml` and `robots.txt`
- Structured data: JSON-LD (Restaurant, LocalBusiness schemas)
- Open Graph + Twitter Cards
- Images: `next/image` with descriptive `alt`
- URLs: `/menu/pizza-muzzarella` (not `/product?id=123`)

---

## Performance

- **Target**: Core Web Vitals green (LCP, CLS, INP)
- **Images**: `next/image` always
- **Code splitting**: `next/dynamic` for heavy components
- **Streaming**: `Suspense` for slow sections
- **Caching**: aggressive server-side caching
- **Bundle**: minimize client JavaScript

---

## Tailwind CSS 4

- Utility-first approach
- Extract reusable patterns into components
- Maintain consistent spacing scale
- Use design tokens for colors, fonts
- Avoid massive `className` strings

---

## State Management

- **Server state**: prefer server-side fetching
- **Cart**: React Context + `localStorage` (client-only)
- **No Redux, no Zustand** unless requirements grow significantly

---

## Code Quality

Required:
- ESLint
- TypeScript strict
- Vitest
- Prettier (when configured)

Rules:
- No dead code
- No `console.log` in production
- No duplicated logic
- Keep functions small and focused

---

## Golden Rules

1. Server First
2. Accessibility First
3. SEO First
4. Security First
5. Type Safety First
6. Minimal Client JavaScript
7. No Admin Panel
8. Google Sheets is the CMS
9. WhatsApp is the checkout
10. Simplicity over complexity
