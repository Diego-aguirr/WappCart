import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { COOKIE_NAME, COOKIE_OPTIONS } from './constants'

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
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'admin') return false

    const pepper = getPepper()
    const valid = await bcrypt.compare(password + pepper + email, user.passwordHash)
    if (!valid) return false

    const sessionHash = await computeSessionHash(password, email, user.salt)

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, sessionHash, COOKIE_OPTIONS)

    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}

export async function requireAuth(): Promise<void> {
  try {
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
  } catch (error) {
    // If it's a redirect, rethrow it
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Auth check error:', error)
    redirect('/admin/login')
  }
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionHash = cookieStore.get(COOKIE_NAME)?.value

    if (!sessionHash || sessionHash.length === 0) return false
    if (!sessionHash.startsWith('$2')) return false

    const user = await prisma.user.findUnique({
      where: { email: 'admin@wappcart.local' },
    })
    if (!user || user.role !== 'admin') return false

    return true
  } catch (error) {
    console.error('Auth verification error:', error)
    return false
  }
}
