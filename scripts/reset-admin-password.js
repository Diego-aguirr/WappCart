#!/usr/bin/env node

/**
 * Reset admin password for WappCart.
 *
 * Usage:
 *   node scripts/reset-admin-password.js <new-password>
 *
 * Environment:
 *   DATABASE_URL  — PostgreSQL connection string
 *   ADMIN_PEPPER  — Server-side pepper (min 32 chars)
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const ADMIN_EMAIL = 'admin@wappcart.local'
const SALT_ROUNDS = 12

async function main() {
  const newPassword = process.argv[2]

  if (!newPassword) {
    console.error('Usage: node scripts/reset-admin-password.js <new-password>')
    process.exit(1)
  }

  if (newPassword.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  const pepper = process.env.ADMIN_PEPPER
  if (!pepper || pepper.length < 32) {
    console.error('ADMIN_PEPPER must be set and at least 32 characters.')
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
    if (!user) {
      console.error(`No user found with email ${ADMIN_EMAIL}. Create one first with create-admin-first-time.js`)
      process.exit(1)
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { passwordHash, salt },
    })

    console.log(`Password reset successfully for ${ADMIN_EMAIL}`)
  } catch (error) {
    console.error('Failed to reset password:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
