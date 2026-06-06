#!/usr/bin/env node

/**
 * Create the first admin user for WappCart.
 *
 * Usage:
 *   node scripts/create-admin-first-time.js <email> <password>
 *
 * Environment:
 *   DATABASE_URL  — PostgreSQL connection string
 *   ADMIN_PEPPER  — Server-side pepper (min 32 chars)
 *
 * This script will only create a user if no admin user exists yet.
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 12

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin-first-time.js <email> <password>')
    process.exit(1)
  }

  if (password.length < 8) {
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
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'admin' } })
    if (existingAdmin) {
      console.error('An admin user already exists. Use reset-admin-password.js to change the password.')
      process.exit(1)
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(password + pepper + email, salt)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        salt,
        role: 'admin',
      },
    })

    console.log(`Admin user created successfully: ${email}`)
  } catch (error) {
    console.error('Failed to create admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
