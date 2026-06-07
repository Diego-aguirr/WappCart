export const COOKIE_NAME = 'admin-session'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 8 * 3600, // 8 hours
  path: '/',
}
