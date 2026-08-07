# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl openssl-dev
RUN corepack enable
RUN corepack prepare pnpm@10.26.2 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Copy prisma schema early so postinstall (prisma generate) works
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl openssl-dev
RUN corepack enable
RUN corepack prepare pnpm@10.26.2 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy DATABASE_URL for build-time static generation (real one provided at runtime)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install OpenSSL for Prisma runtime + curl for health check
RUN apk add --no-cache openssl curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema for migrations
COPY --from=builder /app/prisma ./prisma

# Install Prisma CLI for migrations (isolated in /app/tools to avoid conflicts)
WORKDIR /app/tools
RUN npm init -y > /dev/null 2>&1 && npm install prisma@5.22.0
WORKDIR /app

# Copy entrypoint
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["/app/docker-entrypoint.sh"]
