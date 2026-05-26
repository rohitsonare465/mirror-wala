import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

const AUTH_ROUTES = ['/login', '/register', '/admin/login'];
const PROTECTED_USER_ROUTES = ['/profile', '/orders', '/checkout', '/wishlist', '/cart', '/account'];
const PROTECTED_ADMIN_ROUTES = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the current user session using Better Auth server-side API
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isProtectedUserRoute = PROTECTED_USER_ROUTES.some(route => pathname.startsWith(route));
  const isProtectedAdminRoute = PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route));

  // 1. Guest access to protected pages
  if (!session) {
    if (isProtectedAdminRoute && pathname !== '/admin/login') {
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(adminLoginUrl);
    }

    if (isProtectedUserRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Already logged in
  if (session) {
    // If trying to access login/register/admin-login
    if (isAuthRoute) {
      if (session.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    // 3. Admin Route protection strictly restricting entry to role === "ADMIN"
    if (isProtectedAdminRoute && pathname !== '/admin/login') {
      if (session.user.role !== 'ADMIN') {
        // Forbidden: Redirect standard user back to main profile page
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    }

    // 4. Customer Route protection (e.g. /account/*) restricting entry to role === "USER"
    if (pathname.startsWith('/account')) {
      if (session.user.role !== 'USER') {
        // Redirect non-customer back to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Ensure proxy runs only on app routes, excluding public static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, SVGs, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)',
  ],
};
