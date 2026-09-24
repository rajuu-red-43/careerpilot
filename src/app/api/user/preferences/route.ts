import { NextResponse } from 'next/server';
import { AUTH_CONFIG, verifySession, signSession } from '../../../../lib/auth';
import { isSupportedLanguage, getLanguage, DEFAULT_LANGUAGE } from '../../../../i18n/languages';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );
  const sessionToken = cookies[AUTH_CONFIG.sessionCookieName];
  return verifySession(sessionToken);
}

/**
 * GET /api/user/preferences
 * Returns the authenticated user's preferred language.
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Authentication required to access user preferences.' },
      { status: 401 }
    );
  }

  // Check database first, fallback to session, then default 'en'
  const dbLang = supabase.getUserLanguagePreference(session.id);
  const preferredLanguage = dbLang || session.preferredLanguage || DEFAULT_LANGUAGE.code;

  return NextResponse.json({
    success: true,
    userId: session.id,
    preferredLanguage,
    languageMeta: getLanguage(preferredLanguage),
  });
}

/**
 * PATCH /api/user/preferences
 * Securely updates the authenticated user's preferred language.
 * Identity is derived exclusively from the server-side session.
 */
export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. You must be signed in to modify preferences.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const candidateLang = body?.preferredLanguage;

    if (!candidateLang || typeof candidateLang !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body. "preferredLanguage" string is required.' },
        { status: 400 }
      );
    }

    const cleanCode = candidateLang.trim().toLowerCase();

    // Validate against centralized language registry
    if (!isSupportedLanguage(cleanCode)) {
      return NextResponse.json(
        {
          error: `Unsupported language code: "${cleanCode}". Must be one of the supported Eighth Schedule or official languages.`,
        },
        { status: 400 }
      );
    }

    // 1. Persist to database
    supabase.setUserLanguagePreference(session.id, cleanCode);

    // 2. Re-sign session cookie with updated preference
    const updatedSession = {
      ...session,
      preferredLanguage: cleanCode,
    };
    const signedToken = signSession(updatedSession);

    const response = NextResponse.json({
      success: true,
      message: `Preferred language updated to ${getLanguage(cleanCode).englishName} (${cleanCode})`,
      preferredLanguage: cleanCode,
      languageMeta: getLanguage(cleanCode),
    });

    // 3. Set updated HttpOnly session cookie
    response.cookies.set(AUTH_CONFIG.sessionCookieName, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse JSON request body.' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  return PATCH(request);
}
