#!/bin/sh
set -e

echo "🚀 Starting WappCart container..."

# Ensure uploads directory exists
mkdir -p /app/uploads

# Run Prisma migrations using isolated CLI
echo "📦 Running Prisma migrations..."
/app/tools/node_modules/.bin/prisma migrate deploy

echo "✅ Migrations complete. Starting server..."

# Start Next.js
exec node server.js
