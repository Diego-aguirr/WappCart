import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that should NOT be redirected
const VALID_ROUTES = [
  '/',
  '/menu',
  '/checkout',
  '/admin',
  '/admin/login',
  '/admin/products',
  '/api/upload',
  '/api/uploads',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow valid routes
  if (VALID_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/Food') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Redirect unknown routes to menu
  const menuUrl = new URL('/menu', request.url)
  return NextResponse.redirect(menuUrl)
}

export const proxyConfig = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
