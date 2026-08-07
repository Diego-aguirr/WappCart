# AGENTS.md

## Quick Reference

| Stack | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5+ (strict) |
| Package Manager | pnpm |
| Database | PostgreSQL 16 + Prisma 5 |
| Auth | Cookie Hash (bcrypt + pepper) |
| Checkout | WhatsApp redirect |
| Validation | Zod |
| Images | Local uploads + Cloudinary (optional) |
| Container | Docker + Docker Compose |

---

## Architecture

**Pattern**: App Router + Feature Colocation

### Directory Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── proxy.ts                # Next.js 16 middleware (redirect unknown routes)
├── not-found.tsx           # Global 404
├── global-error.tsx        # Global error boundary
├── checkout/               # Feature: Checkout
│   ├── actions.ts          # Server Actions (submitOrder)
│   ├── page.tsx            # Checkout page
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── admin/                  # Feature: Admin
│   ├── actions.ts          # Server Actions (CRUD, logout)
│   ├── page.tsx            # Admin panel
│   ├── logout-button.tsx   # Client component
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── login/
│   │   ├── page.tsx
│   │   └── login-form.tsx
│   └── products/
│       ├── page.tsx
│       ├── product-form.tsx
│       ├── delete-button.tsx
│       └── toggle-availability.tsx
├── menu/                   # Feature: Menu
│   ├── page.tsx            # Menu page
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── [slug]/
│       └── page.tsx        # Product detail
└── api/
    ├── upload/route.ts     # File upload
    └── uploads/[filename]/route.ts  # Serve uploads

components/
├── Header.tsx              # Global header
└── MenuItem.tsx            # Menu item card

lib/
├── admin-auth.ts           # Cookie hash auth (login, requireAuth, verifyAuth)
├── constants.ts            # COOKIE_NAME, COOKIE_OPTIONS
├── cart-context.tsx        # Cart React Context + localStorage
├── format.ts               # formatPrice utility
├── prisma.ts               # Prisma client singleton
├── products.ts             # Product CRUD
├── security.ts             # Sanitization, rate limiting, file validation
└── types.ts                # Product, CartItem types

prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Seed data
└── migrations/             # Database migrations

scripts/
├── create-admin-first-time.js   # Create first admin
├── reset-admin-password.js      # Reset admin password
├── docker-entrypoint.sh         # Container startup script
└── generate-pepper.sh           # Generate secure pepper

uploads/                    # User uploaded images (gitignored)
```

### Principles

1. **Colocation** — Server Actions live next to their feature
2. **Server First** — default to Server Components, `'use client'` only when needed
3. **Minimal client JS** — every `'use client'` is a conscious decision
4. **Type safety** — Zod schemas at boundaries, TypeScript everywhere else

---

## Docker Architecture

### Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (deps → builder → runner) |
| `docker-compose.yml` | Base configuration (shared) |
| `docker-compose.dev.yml` | Development overrides |
| `docker-compose.prod.yml` | Production overrides |
| `.dockerignore` | Build context exclusions |
| `.env.docker` | Development environment |
| `.env.prod` | Production environment (gitignored) |
| `scripts/docker-entrypoint.sh` | Container startup script |

### Dockerfile Stages

```
Stage 1 (deps):     Install dependencies, generate Prisma client
Stage 2 (builder):  Build Next.js app with standalone output
Stage 3 (runner):   Copy only what's needed, run as non-root
```

### Commands

```bash
# Development
dcdev up --build
dcdev down
dcdev logs app

# Production
dcprod up --build -d
dcprod down
dcprod logs app
```

### Health Checks

- **PostgreSQL**: `pg_isready -U wappcart -d wappcart`
- **App**: `curl -f http://localhost:3000`

### Environment Variables

| Variable | Dev Value | Prod Value |
|----------|-----------|------------|
| DATABASE_URL | `postgresql://user:pass@db:5432/wappcart` | `postgresql://user:pass@db:5432/wappcart` |
| COOKIE_SECURE | `false` | `true` |
| NODE_ENV | `development` | `production` |

---

## Next.js 16 Rules

### Async APIs

`params`, `searchParams`, `cookies()`, and `headers()` are now **async**:

```typescript
// Pages
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
}

// Cookies
const cookieStore = await cookies();
```

### Proxy (was middleware.ts)

```typescript
// app/proxy.ts
export function proxy(request: NextRequest) {
  // Redirect unknown routes to /menu
}
export const proxyConfig = { matcher: ["/((?!_next|static|favicon).*)"] };
```

### Server Actions

```typescript
"use server";
export async function submitOrder(formData: FormData, items: CartItem[]) {
  // 1. Validate with Zod
  // 2. Sanitize inputs
  // 3. Process
  // 4. Return result
}
```

### Error Handling

Every route should have:

| File | Purpose |
|------|---------|
| `error.tsx` | Error boundary (`'use client'`) |
| `not-found.tsx` | 404 UI |
| `loading.tsx` | Loading skeleton |

**Critical**: Do NOT wrap `redirect()` in try-catch.

---

## Auth System

### Cookie Hash Auth (no JWT)

```
Login: bcrypt.hash(password + pepper + email, salt) → httpOnly cookie
Request: cookie exists + valid bcrypt format + admin user exists → grant
```

### Config

```typescript
// lib/constants.ts
COOKIE_NAME = 'admin-session'
COOKIE_OPTIONS = { httpOnly, secure, sameSite: 'strict', maxAge: 8h }
```

### Admin Credentials

### Recovery Scripts

```bash
node scripts/create-admin-first-time.js
node scripts/reset-admin-password.js <new-password>
```

---

## Database

### Prisma Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  salt         String
  role         String   @default("user")
  createdAt    DateTime @default(now())
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Float
  image       String
  category    String
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Security

### Input Validation

- Validate **every** user input with Zod
- Sanitize strings with `sanitizeString()` (removes `<`, `>`, event handlers)
- Never trust `FormData`

### Rate Limiting

- In-memory rate limiter in `lib/security.ts`
- Applied to upload route (10 req/min/IP)

### File Upload

- Max 5MB
- Allowed: PNG, JPEG, WebP, GIF
- Sanitized filenames
- Auth required

### Headers

```typescript
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
```

---

## Checkout Flow

1. Client adds items to cart (localStorage)
2. Client fills form (name, phone, address, payment method)
3. Server validates with Zod + sanitizes
4. Server generates WhatsApp message
5. Client redirected to WhatsApp with pre-filled message
6. Cart cleared

### Payment Methods

- Efectivo
- Transferencia

---

## Styling

### Design System

- **Primary**: `bg-neutral-900` (buttons, accents)
- **Secondary**: `bg-neutral-100` (subtle backgrounds)
- **Danger**: `bg-red-50` (delete actions)
- **Focus**: `focus:ring-neutral-900/10 focus:border-neutral-400`
- **Transitions**: `transition-all duration-200`

### Button Pattern

```tsx
<button className="bg-neutral-900 text-white font-bold py-3 rounded-xl
  hover:bg-black active:scale-[0.98] disabled:opacity-50 transition-all">
```

---

## Accessibility

- All images: `alt` text
- Forms: labels associated with inputs
- Buttons: `aria-label` for icon-only buttons
- `aria-hidden="true"` for decorative icons
- `aria-live="polite"` for dynamic content
- Keyboard navigation required
- Semantic HTML: `header`, `main`, `nav`, `section`

---

## Golden Rules

1. Server First
2. Colocation over separation
3. Security First
4. Type Safety First
5. Minimal Client JavaScript
6. WhatsApp is the checkout
7. PostgreSQL is the database
8. Simplicity over complexity
9. Docker for portability
10. Development and production parity
