import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true'
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !request.nextUrl.pathname.endsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // If authenticated and on login page, redirect to admin dashboard
    if (isAuthenticated && request.nextUrl.pathname.endsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
} 