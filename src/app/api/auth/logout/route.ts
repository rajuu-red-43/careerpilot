import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('callbackUrl') || '/login';

  const response = NextResponse.json({ success: true, redirectTo });

  response.cookies.set(AUTH_CONFIG.sessionCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('callbackUrl') || '/login';
  const destination = new URL(redirectTo, request.url);

  const response = NextResponse.redirect(destination);

  response.cookies.set(AUTH_CONFIG.sessionCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
