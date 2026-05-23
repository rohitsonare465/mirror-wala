import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_USER_ROUTES = ['/profile', '/orders', '/checkout', '/wishlist', '/cart'];
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

  // 1. Guest access to profile/orders/checkout/wishlist/cart -> Redirect to Login
  if (isProtectedUserRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already logged in -> Redirect away from Login/Register to Profile
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // 3. Admin Route protection strictly restricting entry to role === "ADMIN"
  if (isProtectedAdminRoute) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.user.role !== 'ADMIN') {
      // Forbidden: Redirect standard user back to main profile page
      return NextResponse.redirect(new URL('/profile', request.url));
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
