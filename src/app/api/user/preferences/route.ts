import { NextResponse } from 'next/server';
import { isSupportedLanguage, getLanguage, DEFAULT_LANGUAGE } from '../../../../i18n/languages';

export const dynamic = 'force-dynamic';

const LANGUAGE_COOKIE_NAME = 'careerpilot_language';

function getLanguageFromCookies(request: Request): string {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );
  const code = cookies[LANGUAGE_COOKIE_NAME];
  if (code && isSupportedLanguage(code)) {
    return code;
  }
  return DEFAULT_LANGUAGE.code;
}

/**
 * GET /api/user/preferences
 * Returns the visitor's preferred language without requiring authentication.
 */
export async function GET(request: Request) {
  const preferredLanguage = getLanguageFromCookies(request);

  return NextResponse.json({
    success: true,
    preferredLanguage,
    languageMeta: getLanguage(preferredLanguage),
  });
}

/**
 * PATCH /api/user/preferences
 * Updates the visitor's preferred language and sets the client-accessible cookie.
 */
export async function PATCH(request: Request) {
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

    if (!isSupportedLanguage(cleanCode)) {
      return NextResponse.json(
        {
          error: `Unsupported language code: "${cleanCode}". Must be one of the supported Eighth Schedule or official languages.`,
        },
        { status: 400 }
      );
    }

    const langMeta = getLanguage(cleanCode);

    const response = NextResponse.json({
      success: true,
      message: `Preferred language updated to ${langMeta.englishName} (${cleanCode})`,
      preferredLanguage: cleanCode,
      languageMeta: langMeta,
    });

    response.cookies.set(LANGUAGE_COOKIE_NAME, cleanCode, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
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
