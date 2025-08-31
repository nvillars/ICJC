import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    // allow public admin pages like the login page and internal next paths
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/_next') || pathname.startsWith('/admin/api/auth')) {
      const res = NextResponse.next()
      // add security headers to allowed responses too
      res.headers.set('X-Frame-Options', 'DENY')
      res.headers.set('X-Content-Type-Options', 'nosniff')
      res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.headers.set('Permissions-Policy', 'camera=(), microphone=()')
      return res
    }
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      const r = NextResponse.redirect(url)
      r.headers.set('X-Frame-Options', 'DENY')
      r.headers.set('X-Content-Type-Options', 'nosniff')
      r.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      return r
    }
    // allow if token exists; further RBAC on API handlers
  }
  const res = NextResponse.next()
  // apply basic security headers globally (adjust CSP as needed)
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=()')
  // HSTS for production only
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  // Minimal CSP that allows Facebook embeds (may need adjustment)
  res.headers.set('Content-Security-Policy', "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://connect.facebook.net; frame-src https://www.facebook.com https://connect.facebook.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:;")
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
