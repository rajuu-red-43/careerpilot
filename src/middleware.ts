import { NextResponse, type NextRequest } from 'next/server';

// Protected application routes requiring authentication
const PROTECTED_PREFIXES = [
  '/job-seeker',
  '/student',
  '/recruiter',
  '/admin',
  '/applications',
  '/compare',
  '/internships',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public assets, Next.js internals, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('careerpilot_session')?.value;
  const hasValidSession = Boolean(sessionCookie && sessionCookie.includes('.'));

  // 2. Protect authenticated dashboard routes
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isProtected && !hasValidSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If user is already authenticated and visits /login, redirect to their role dashboard
  if (pathname === '/login' && sessionCookie && hasValidSession) {
    try {
      const [encodedPayload] = sessionCookie.split('.');
      const payloadStr = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsed = JSON.parse(payloadStr);

      let target = '/job-seeker';
      if (parsed.role === 'college_student') target = '/student';
      else if (parsed.role === 'company_recruiter') target = '/recruiter';
      else if (parsed.role === 'admin') target = '/admin';

      return NextResponse.redirect(new URL(target, request.url));
    } catch {
      // If parsing fails, allow viewing login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
