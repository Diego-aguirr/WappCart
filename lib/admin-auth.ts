import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'admin-session'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 8 * 3600, // 8 hours
  path: '/',
}

function getPepper(): string {
  const pepper = process.env.ADMIN_PEPPER
  if (!pepper || pepper.length < 32) {
    throw new Error('ADMIN_PEPPER must be set and at least 32 characters')
  }
  return pepper
}

async function computeSessionHash(
  password: string,
  email: string,
  salt: string
): Promise<string> {
  const pepper = getPepper()
  return bcrypt.hash(password + pepper + email, salt)
}

export async function login(
  email: string,
  password: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== 'admin') return false

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return false

  const sessionHash = await computeSessionHash(password, email, user.salt)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionHash, COOKIE_OPTIONS)

  return true
}

export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies()
  const sessionHash = cookieStore.get(COOKIE_NAME)?.value

  if (!sessionHash || sessionHash.length === 0) {
    redirect('/admin/login')
  }

  // Verify cookie is a valid bcrypt hash (set by our login function)
  if (!sessionHash.startsWith('$2')) {
    redirect('/admin/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: 'admin@wappcart.local' },
  })
  if (!user || user.role !== 'admin') {
    redirect('/admin/login')
  }
}

export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionHash = cookieStore.get(COOKIE_NAME)?.value

  if (!sessionHash || sessionHash.length === 0) return false
  if (!sessionHash.startsWith('$2')) return false

  const user = await prisma.user.findUnique({
    where: { email: 'admin@wappcart.local' },
  })
  if (!user || user.role !== 'admin') return false

  return true
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 })
  redirect('/admin/login')
}
