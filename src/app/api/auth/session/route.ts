import { NextResponse } from 'next/server';
import { AUTH_CONFIG, verifySession } from '../../../../lib/auth';

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
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      image: session.image || null,
      role: session.role,
      provider: session.provider,
    },
  });
}
