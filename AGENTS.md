# WappCart - Agent.md

## Project Overview

WappCart is a WhatsApp-first food ordering platform built for small businesses.

Examples:

- Pizzerias
- Burger Shops
- Fast Food Restaurants
- Bakeries
- Empanada Stores

Customers browse products, add items to a cart, complete delivery information, and place orders directly through WhatsApp.

Business owners manage products through Google Sheets.

No admin panel.

No authentication.

No payment gateway.

Google Sheets acts as the CMS.

WhatsApp acts as the checkout system.

---

# Tech Stack

| Category        | Technology                     |
| --------------- | ------------------------------ |
| Framework       | Next.js 16                     |
| UI              | React 19                       |
| Styling         | Tailwind CSS 4                 |
| Language        | TypeScript 5+                  |
| Validation      | Zod                            |
| Package Manager | pnpm                           |
| Testing         | Vitest + React Testing Library |
| CMS             | Google Sheets                  |
| Checkout        | WhatsApp                       |

---

# Architecture

## Architecture Name

Vertical Slice Architecture + Server Components First

## Core Principles

### Server First

Default to Server Components.

Use Client Components only when:

- useState is required
- Browser APIs are required
- User interaction requires hydration

### Feature First

Organize code by business feature.

Good:

features/
├── products
├── categories
├── cart
└── checkout

Bad:

components/
hooks/
services/
utils/

### Clean Boundaries

Flow:

UI
↓
Feature
↓
Service
↓
External Source

Never access Google Sheets directly from UI components.

### Minimal Client JavaScript

Hydrate only interactive sections:

- Cart
- Mobile Navigation
- Drawer Components

Everything else should remain server-rendered.

---

# Directory Structure

src/

app/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
├── sitemap.ts
├── robots.ts
├── proxy.ts
│
├── checkout/
│ └── page.tsx
│
└── actions/
├── cart.ts
└── order.ts

features/

├── products/
│ ├── components/
│ ├── services/
│ ├── mappers/
│ ├── types/
│ └── utils/
│
├── categories/
│ ├── components/
│ └── services/
│
├── cart/
│ ├── components/
│ ├── provider/
│ ├── hooks/
│ ├── types/
│ └── utils/
│
└── checkout/
├── components/
├── validation/
└── utils/

components/

├── ui/
├── layout/
└── shared/

lib/

├── sheets/
├── whatsapp/
├── cache/
└── env/

schemas/

├── product.ts
├── category.ts
├── order.ts
└── env.ts

config/

├── site.ts
└── features.ts

types/

public/

---

# Google Sheets CMS

Google Sheets is the single source of truth.

Columns:

- id
- name
- category
- description
- price
- image
- available

Example:

| id  | name             | category | price |
| --- | ---------------- | -------- | ----- |
| 1   | Pizza Muzzarella | Pizzas   | 12000 |

All Google Sheets requests must run on the server.

Never expose credentials to the browser.

Map sheet rows into typed domain objects before rendering.

---

# Next.js 16 Rules

## Server Components

Always prefer Server Components.

Example:

export default async function Page() {
const products = await getProducts()
return <ProductsGrid products={products} />
}

Avoid "use client" unless absolutely necessary.

---

## Server Actions

Use Server Actions for:

- Checkout
- Forms
- Mutations

Prefer Server Actions over Route Handlers.

---

## Route Handlers

Only create Route Handlers when:

- Webhooks are required
- Public APIs are required
- External integrations require them

Never create API routes for internal application logic.

---

## Data Fetching

Priority:

1. Server Component
2. Server Action
3. Route Handler

Never fetch through an API route when a Server Component can access data directly.

---

## Caching

Products change infrequently.

Use:

export const revalidate = 300

or

unstable_cache()

Default cache duration:

5 minutes.

---

## Parallel Data Fetching

Prefer:

const [products, categories] = await Promise.all([
getProducts(),
getCategories(),
])

Avoid sequential requests.

---

# TypeScript Rules

Strict mode enabled.

Never use:

any

Prefer:

unknown

Use:

type

by default.

Use:

interface

only when extension is required.

---

# Validation Rules

Use Zod at all external boundaries.

Validate:

- Environment variables
- Google Sheets rows
- Form submissions
- URL parameters

Never trust external data.

---

# Security Rules

## Environment Variables

Validate all environment variables on startup.

Use a centralized env module.

Never access process.env directly throughout the application.

Never commit .env files.

---

## Input Validation

All form data must:

Validate
↓
Sanitize
↓
Process

Never trust FormData.

Always validate with Zod.

---

## XSS Protection

Never use:

dangerouslySetInnerHTML

unless absolutely necessary.

---

## Rate Limiting

Protect checkout submissions.

Recommended:

Upstash Rate Limit.

---

# Accessibility

Target:

WCAG 2.2 AA

Requirements:

- Keyboard navigation
- Focus states
- Semantic HTML
- Accessible forms
- Image alt text
- Proper contrast ratios

Prefer native HTML before ARIA.

---

# SEO

Every page must include:

- Title
- Description
- Canonical URL

Use:

generateMetadata()

Generate:

- sitemap.xml
- robots.txt

Use structured data:

- Restaurant Schema
- LocalBusiness Schema

Use next/image for all images.

Prefer descriptive URLs:

/menu/pizza-muzzarella

Avoid:

/product?id=1

---

# Performance

Goals:

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

Rules:

- Server render whenever possible
- Minimize hydration
- Use Suspense when appropriate
- Use dynamic imports for heavy components
- Optimize all images

---

# State Management

Server State:

Server Components

Client State:

Cart only

Implementation:

React Context

- localStorage

Do not introduce:

- Redux
- MobX
- Zustand

unless future requirements justify it.

---

# Testing

Tools:

- Vitest
- React Testing Library

Test:

- Cart calculations
- Product mapping
- WhatsApp message generation
- Validation schemas

Focus on behavior rather than implementation details.

---

# Code Quality

Required:

- ESLint
- TypeScript Strict
- Prettier

Rules:

- No dead code
- No duplicated logic
- No console.log in production
- Small focused functions
- Explicit naming

---

# Product Model

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

---

# Category Model

type Category = {
id: string
name: string
slug: string
}

---

# Order Model

type Order = {
customerName: string
phone: string
address: string
notes?: string
products: CartItem[]
total: number
}

---

# Checkout Flow

Customer
↓
Browse Products
↓
Add To Cart
↓
Checkout Form
↓
Validate
↓
Generate WhatsApp Message
↓
Redirect To WhatsApp

No database required.

No order persistence required.

WhatsApp is the final destination.

---

# Golden Rules

1. Server First.
2. Feature First.
3. Accessibility First.
4. SEO First.
5. Security First.
6. Type Safety First.
7. Minimal Client JavaScript.
8. No Admin Panel.
9. Google Sheets is the CMS.
10. WhatsApp is the Checkout.
11. Fetch on the Server whenever possible.
12. Prefer Server Actions over API Routes.
13. Simplicity over Complexity.
14. Build reusable features.
15. Optimize for maintainability, not cleverness.
