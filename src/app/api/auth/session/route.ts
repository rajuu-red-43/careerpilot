import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { AUTH_CONFIG, verifySession, signSession } from '../../../../lib/auth';
import { UserRole, UserSession } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const sessionToken = cookies[AUTH_CONFIG.sessionCookieName];
  const session = verifySession(sessionToken);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      name: session.name,
      email: session.email || null,
      phone: session.phone || null,
      image: session.image || null,
      role: session.role,
      provider: session.provider,
      preferredLanguage: session.preferredLanguage || 'en',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role: UserRole = body?.role || 'college_student';
    const name = body?.name?.trim() || (role === 'college_student' ? 'Student' : 'CareerPilot User');
    const preferredLanguage = body?.preferredLanguage || 'en';

    const session: UserSession = {
      id: crypto.randomUUID(),
      name,
      role,
      provider: 'session',
      preferredLanguage,
      expiresAt: Date.now() + AUTH_CONFIG.sessionMaxAge * 1000,
    };

    const sessionToken = signSession(session);
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: session,
    });

    response.cookies.set(AUTH_CONFIG.sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.sessionMaxAge,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session.' },
      { status: 500 }
    );
  }
}
