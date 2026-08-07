# WappCart

Catálogo de comidas con carrito y checkout por WhatsApp.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5+ (strict) |
| Package Manager | pnpm |
| Database | PostgreSQL 16 + Prisma 5 |
| Auth | Cookie Hash (bcrypt + pepper) |
| Checkout | WhatsApp redirect |
| Validation | Zod |
| Container | Docker + Docker Compose |

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### 1. Clone and configure

```bash
git clone <repo-url>
cd WappCart
cp .env.docker.example .env.docker
```

Edit `.env.docker` with your credentials.

### 2. Start development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Seed database (optional)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx tsx prisma/seed.ts
```

## Development

### Commands

| Command | Description |
|---------|-------------|
| `dcdev up --build` | Start dev environment |
| `dcdev down` | Stop all containers |
| `dcdev logs app` | View app logs |
| `dcdev ps` | Check container status |

> **Note:** `dcdev` is an alias. Add to your `~/.bashrc`:
> ```bash
> alias dcdev='docker compose -f docker-compose.yml -f docker-compose.dev.yml'
> ```

### Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Next.js application |
| app | 9229 | Node.js debugger |
| db | 5433 | PostgreSQL database |

### Hot Reload

Source code is mounted as a volume. Changes to `src/`, `public/`, and `prisma/` are reflected instantly.

## Production

### Environment Variables

Create `.env.prod`:

```env
DATABASE_URL="postgresql://user:password@db:5432/wappcart"
POSTGRES_PASSWORD=your_secure_password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password
ADMIN_PEPPER=your_64_char_hex
COOKIE_SECURE=true
WHATSAPP_NUMBER=your_country_code_phone
```

### Deploy

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

### Production Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Hot reload | Yes | No |
| DB port exposed | Yes (5433) | No |
| NODE_ENV | development | production |
| COOKIE_SECURE | false | true |
| Restart policy | no | unless-stopped |
| Resource limits | None | 512MB / 1 CPU |
| Logs | All | Rotated (10MB x 3) |

## Database

### Migrations

Migrations run automatically on container startup.

### Reset Database

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Prisma Studio

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app npx prisma studio
```

## Admin

### Default Credentials

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** Set in `.env.docker`
- **Password:** Set in `.env.docker`

### Create Admin

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app node scripts/create-admin-first-time.js
```

### Reset Password

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec app node scripts/reset-admin-password.js <new-password>
```

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/create-admin-first-time.js` | Create initial admin user |
| `scripts/reset-admin-password.js` | Reset admin password |
| `scripts/docker-entrypoint.sh` | Container startup script |
| `scripts/generate-pepper.sh` | Generate secure pepper |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel
│   ├── checkout/           # WhatsApp checkout
│   ├── menu/               # Menu display
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities and helpers
├── prisma/                 # Database schema and migrations
├── scripts/                # Utility scripts
├── uploads/                # User uploads (gitignored)
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Base configuration
├── docker-compose.dev.yml  # Development overrides
├── docker-compose.prod.yml # Production overrides
└── .env.docker             # Docker environment template
```

## Troubleshooting

### Container won't start

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs app
```

### Database connection failed

Ensure the DB container is healthy:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

Both services should show `(healthy)`.

### Port already in use

Change the port in `docker-compose.dev.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Reset everything

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## License

MIT
