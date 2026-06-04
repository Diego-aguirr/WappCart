import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'wappcart-secret-123')

export async function verifyAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== 'admin') return null
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null
  return user
}

export async function createAdminToken(userId: string) {
  return new SignJWT({ userId, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.userId as string
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function requireAdmin() {
  const userId = await getAdminSession()
  if (!userId) {
    throw new Error('Unauthorized')
  }
  return userId
}
