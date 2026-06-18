# WappCart

Catálogo de comidas con carrito y checkout por WhatsApp.

## Levantar el proyecto

### 1. Docker (PostgreSQL)

```bash
docker compose up -d
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Migraciones y seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Prisma Studio (ver la base de datos)

```bash
npx prisma studio
```

Abre en [http://localhost:5555](http://localhost:5555)

### 5. Dev server

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Admin

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- Creá tu propio admin con: `node scripts/create-admin-first-time.js`

## Apagar todo

```bash
docker compose down
```
