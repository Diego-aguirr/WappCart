# WappCart

A food ordering catalog (menu + cart + WhatsApp checkout) for small businesses. Built with Next.js 16, PostgreSQL, and Prisma.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) & Docker Compose

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/Diego-aguirr/WappCart.git
cd WappCart
pnpm install
```

### 2. Start PostgreSQL (Docker)

```bash
pnpm db:up
```

This starts a PostgreSQL 16 container on port `5432`.

### 3. Run database migrations

```bash
pnpm prisma:migrate
```

### 4. Seed the database

```bash
pnpm prisma:seed
```

This creates:
- 5 sample products
- 1 admin user (`admin@wappcart.com` / `admin123`)

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Prisma Studio

Prisma Studio is a visual database management tool included with Prisma. It lets you view and edit your database records through a web interface.

### Install Prisma Studio globally (optional but recommended)

Prisma Studio comes bundled with Prisma CLI. If you want to use it as a standalone tool:

```bash
# Prisma Studio is included when you install Prisma
pnpm add -g prisma

# Or use npx (no global install needed)
npx prisma studio
```

### Launch Prisma Studio

```bash
# Using the local Prisma installation (recommended)
npx prisma studio

# Or with pnpm
pnpm prisma studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555).

### What you can do with Prisma Studio

- **Browse data**: View all products, users, and other records
- **Edit records**: Click any cell to edit values inline
- **Add records**: Create new products or users manually
- **Delete records**: Remove unwanted entries
- **Filter and sort**: Search and organize your data

### Prisma Studio vs Admin Panel

| Tool | Best for | Access |
|------|----------|--------|
| **Prisma Studio** | Direct database inspection, bulk edits, debugging | `npx prisma studio` → localhost:5555 |
| **Admin Panel** | Client-facing product management, image URLs, validations | `/admin` in the app |

---

## Admin Panel

The app includes a built-in admin panel for managing products.

### Login

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@wappcart.com`
- **Password**: `admin123`

### Features

- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Toggle product availability

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build for production |
| `pnpm db:up` | Start PostgreSQL Docker container |
| `pnpm db:down` | Stop PostgreSQL Docker container |
| `pnpm prisma:generate` | Generate Prisma Client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio GUI |

---

## Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript 5 (strict)
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: [Prisma](https://www.prisma.io/) 5
- **Auth**: JWT cookies with [jose](https://github.com/panva/jose)
- **Validation**: [Zod](https://zod.dev/)
- **Package Manager**: pnpm

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Studio Guide](https://www.prisma.io/docs/orm/tools/prisma-studio)

## Deploy on Vercel

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com/new).

For production, you'll need a hosted PostgreSQL database (e.g., [Supabase](https://supabase.com/), [Railway](https://railway.app/), or [Neon](https://neon.tech/)).
