# Arquitectura de WappCart

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.2.7 | Framework |
| React | 19 | UI |
| TypeScript | 5+ | Lenguaje |
| Tailwind CSS | 4 | Estilos |
| Prisma | 5 | ORM |
| PostgreSQL | 16 | Base de datos |
| Zod | - | Validación |

---

## Arquitectura: App Router + Feature Colocation

### Definición

- **App Router**: Sistema de routing de Next.js 13+ (carpeta `app/`)
- **Feature Colocation**: Mantener código relacionado junto a su feature
- **Server Components**: Componentes que corren en el servidor (por defecto)
- **Server Actions**: Funciones que corren en el servidor, llamadas desde el cliente

### Estructura del proyecto

```
app/
├── checkout/              ← Feature: Checkout
│   ├── actions.ts         ← Server Actions (submitOrder)
│   ├── page.tsx           ← Vista del checkout
│   ├── loading.tsx        ← Loading state
│   ├── error.tsx          ← Error boundary
│   └── not-found.tsx      ← 404
├── admin/                 ← Feature: Admin
│   ├── actions.ts         ← Server Actions (CRUD productos, logout)
│   ├── page.tsx           ← Panel principal
│   ├── logout-button.tsx  ← Componente cliente
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── login/             ← Sub-feature: Login
│   │   ├── page.tsx
│   │   └── login-form.tsx
│   └── products/          ← Sub-feature: Productos
│       ├── page.tsx
│       ├── product-form.tsx
│       ├── delete-button.tsx
│       └── toggle-availability.tsx
├── menu/                  ← Feature: Menú
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── [slug]/            ← Dynamic route
│       └── page.tsx
├── api/                   ← API Routes (solo si necesario)
│   ├── upload/route.ts
│   └── uploads/[filename]/route.ts
├── layout.tsx             ← Root layout
├── page.tsx               ← Home page
├── proxy.ts               ← Middleware (Next.js 16)
├── not-found.tsx          ← Global 404
└── global-error.tsx       ← Global error boundary
```

### Principios

1. **Colocación**: Cada Server Action vive junto a su feature
2. **Server First**: Por defecto Server Components, `'use client'` solo cuando es necesario
3. **Feature Auto-contenida**: Si necesitás algo del checkout, todo está en `app/checkout/`
4. **Mínimo Client JS**: Cada `'use client'` es una decisión consciente

### Convenciones

| Archivo | Propósito |
|---------|-----------|
| `page.tsx` | Vista principal de la ruta |
| `loading.tsx` | Loading state (Suspense) |
| `error.tsx` | Error boundary (debe ser `'use client'`) |
| `not-found.tsx` | UI de 404 |
| `actions.ts` | Server Actions (mutaciones) |
| `layout.tsx` | Layout compartido |

---

## Next.js 16: Características principales

### Async APIs

En Next.js 16, `params`, `searchParams`, `cookies()` y `headers()` son **async**:

```ts
// Pages y Layouts
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}

// Cookies
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
}
```

### Proxy (era middleware.ts)

```ts
// app/proxy.ts (Next.js 16)
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ['/api/:path*'],
}
```

### Server Actions

```ts
'use server'

export async function submitOrder(formData: FormData) {
  // 1. Validate
  // 2. Process
  // 3. Return result
}
```

### Directivas

| Directiva | Propósito | Cuándo usar |
|-----------|-----------|-------------|
| `'use client'` | Client Component | State, browser APIs, event handlers |
| `'use server'` | Server Action | Mutaciones, form handling |
| `'use cache'` | Cache Component | Data que rara vez cambia |

---

## Server Actions en WappCart

### Checkout

```ts
// app/checkout/actions.ts
'use server'

export async function submitOrder(formData: FormData, items: CartItem[]) {
  // Valida con Zod
  // Genera mensaje WhatsApp
  // Retorna URL de WhatsApp
}
```

### Admin

```ts
// app/admin/actions.ts
'use server'

export async function createProductAction(prevState, formData) { ... }
export async function updateProductAction(id, prevState, formData) { ... }
export async function deleteProductAction(id) { ... }
export async function toggleProductAvailability(prevState, formData) { ... }
export async function logoutAction() { ... }
```

---

## Autenticación

### Cookie Hash Auth (no JWT)

```
Login → bcrypt.hash(password + pepper + email, salt) → cookie httpOnly
Request → cookie → verify format + user exists → grant/deny
```

### Configuración

```ts
// lib/constants.ts
export const COOKIE_NAME = 'admin-session'
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 8 * 3600, // 8 hours
  path: '/',
}
```

---

## Patrón de Componentes

### Server Components (por defecto)

```tsx
// app/menu/page.tsx
import { getProducts } from '@/lib/products'

export default async function MenuPage() {
  const products = await getProducts() // Fetch directo, no API
  return <MenuList products={products} />
}
```

### Client Components (solo cuando es necesario)

```tsx
// components/MenuItem.tsx
'use client'

import { useCart } from '@/lib/cart-context'

export function MenuItem({ product }) {
  const { addItem } = useCart() // State del cliente
  return <button onClick={() => addItem(product)}>Agregar</button>
}
```

---

## Decisiones de arquitectura

| Decisión | Por qué |
|----------|---------|
| Feature Colocation | Proyecto pequeño, código junto a su feature |
| Cookie Hash (no JWT) | Single admin, no necesita complejidad de JWT |
| Prisma (no SQL raw) | Type safety, migraciones, DX |
| Zod (no Yup) | Performance, TypeScript-first |
| Tailwind (no CSS modules) | Rapidez, consistencia, utility-first |
| WhatsApp checkout (no Stripe) | Modelo de negocio simple |
| Google Sheets (no DB admin) | El admin usa la DB directamente |

---

## Referencias

- [Next.js 16 Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Prisma](https://www.prisma.io/docs)
