import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE, isValidSession } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const loggedIn = isValidSession(token)

  if (pathname.startsWith('/login')) {
    if (loggedIn) {
      return NextResponse.redirect(new URL('/internet', request.url))
    }
    return NextResponse.next()
  }

  if (!loggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Protect all routes except Next.js internals and static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
