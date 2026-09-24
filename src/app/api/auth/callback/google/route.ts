import { NextResponse } from 'next/server';
import {
  AUTH_CONFIG,
  getGoogleRedirectUri,
  verifyOAuthState,
  signSession,
} from '../../../../../lib/auth';
import { UserRole, UserSession } from '../../../../../lib/types';

export const dynamic = 'force-dynamic';

function getDashboardHrefForRole(role: UserRole): string {
  if (role === 'college_student') return '/student';
  if (role === 'company_recruiter') return '/recruiter';
  if (role === 'admin') return '/admin';
  return '/job-seeker';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const redirectUri = getGoogleRedirectUri(request);

  // 1. Handle error or cancellation from Google consent screen
  if (error) {
    const errorUrl = new URL('/login', request.url);
    if (error === 'access_denied') {
      errorUrl.searchParams.set('error', 'AccessDenied');
      errorUrl.searchParams.set('message', 'Google sign-in was cancelled.');
    } else {
      errorUrl.searchParams.set('error', 'OAuthError');
      errorUrl.searchParams.set('message', `Google OAuth returned error: ${error}`);
    }
    return NextResponse.redirect(errorUrl);
  }

  // 2. Validate presence of code and state
  if (!code || !state) {
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'MissingCode');
    errorUrl.searchParams.set('message', 'Authorization code or state parameter was not received from Google.');
    return NextResponse.redirect(errorUrl);
  }

  // 3. Read and verify state cookie to prevent CSRF attacks
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const stateCookieToken = cookies[AUTH_CONFIG.oauthStateCookieName];
  const oauthState = verifyOAuthState(stateCookieToken);

  if (!oauthState || oauthState.state !== state) {
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'InvalidState');
    errorUrl.searchParams.set('message', 'OAuth state verification failed. Potential CSRF or expired session.');
    return NextResponse.redirect(errorUrl);
  }

  try {
    // 4. Exchange authorization code for tokens at Google's token endpoint
    const tokenResponse = await fetch(AUTH_CONFIG.googleTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: AUTH_CONFIG.googleClientId,
        client_secret: AUTH_CONFIG.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: oauthState.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange error:', errorData);
      const errorUrl = new URL('/login', request.url);
      errorUrl.searchParams.set('error', 'TokenExchangeFailed');
      errorUrl.searchParams.set('message', 'Failed to exchange authorization code for Google access token.');
      return NextResponse.redirect(errorUrl);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      const errorUrl = new URL('/login', request.url);
      errorUrl.searchParams.set('error', 'MissingAccessToken');
      errorUrl.searchParams.set('message', 'Google token response did not contain an access token.');
      return NextResponse.redirect(errorUrl);
    }

    // 5. Fetch verified user information from Google
    const userInfoResponse = await fetch(AUTH_CONFIG.googleUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorUrl = new URL('/login', request.url);
      errorUrl.searchParams.set('error', 'UserInfoFailed');
      errorUrl.searchParams.set('message', 'Failed to retrieve profile information from Google.');
      return NextResponse.redirect(errorUrl);
    }

    const userInfo = await userInfoResponse.json();

    // 6. Build CareerPilot user session
    const targetRole: UserRole = oauthState.targetRole || 'job_seeker';
    const session: UserSession = {
      id: userInfo.sub,
      name: userInfo.name || (userInfo.email ? userInfo.email.split('@')[0] : 'Google User'),
      email: userInfo.email || '',
      image: userInfo.picture || '',
      role: targetRole,
      provider: 'google',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30-day session
    };

    // 7. Sign session token using HMAC-SHA256
    const sessionToken = signSession(session);

    // 8. Determine destination URL
    let destinationPath = getDashboardHrefForRole(targetRole);
    if (oauthState.callbackUrl && oauthState.callbackUrl.startsWith('/') && !oauthState.callbackUrl.startsWith('//')) {
      destinationPath = oauthState.callbackUrl;
    }

    const destinationUrl = new URL(destinationPath, request.url);
    destinationUrl.searchParams.set('login', 'success');

    // 9. Create response, set persistent HttpOnly session cookie, and clear oauth state cookie
    const response = NextResponse.redirect(destinationUrl);

    response.cookies.set(AUTH_CONFIG.sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Clear state cookie
    response.cookies.set(AUTH_CONFIG.oauthStateCookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: unknown) {
    console.error('Unexpected error during Google OAuth callback:', err);
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'ServerError');
    errorUrl.searchParams.set('message', 'An unexpected error occurred during Google sign-in.');
    return NextResponse.redirect(errorUrl);
  }
}
