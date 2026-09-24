import { NextResponse, type NextRequest } from 'next/server';

/**
 * CareerPilot v2 Open Visitor Access Middleware
 * All routes are directly accessible to public visitors without authentication.
 * Any legacy requests to /login are seamlessly redirected to the home page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Redirect legacy /login requests directly to home
  if (pathname === '/login' || pathname.startsWith('/login/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files & images
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
