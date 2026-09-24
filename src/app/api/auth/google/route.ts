import { NextResponse } from 'next/server';
import {
  AUTH_CONFIG,
  getGoogleRedirectUri,
  generateRandomString,
  generateCodeChallenge,
  signOAuthState,
} from '../../../../lib/auth';
import { UserRole } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetRole = (url.searchParams.get('role') as UserRole) || 'job_seeker';
  const callbackUrl = url.searchParams.get('callbackUrl') || '';

  // 1. Validate that Google OAuth credentials exist in environment variables
  if (!AUTH_CONFIG.googleClientId || !AUTH_CONFIG.googleClientSecret) {
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'ConfigurationMissing');
    errorUrl.searchParams.set(
      'message',
      'Google OAuth credentials (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET) are missing from your environment variables.'
    );
    return NextResponse.redirect(errorUrl);
  }

  // 2. Generate PKCE and CSRF state parameters
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(48);
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const redirectUri = getGoogleRedirectUri(request);

  // 3. Build Google Authorization URL
  const googleAuthParams = new URLSearchParams({
    client_id: AUTH_CONFIG.googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: AUTH_CONFIG.scopes,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'select_account',
  });

  const authorizationUrl = `${AUTH_CONFIG.googleAuthUrl}?${googleAuthParams.toString()}`;

  // 4. Create response and set signed state cookie
  const response = NextResponse.redirect(authorizationUrl);

  const stateToken = signOAuthState({
    state,
    codeVerifier,
    targetRole,
    callbackUrl,
    timestamp: Date.now(),
  });

  response.cookies.set(AUTH_CONFIG.oauthStateCookieName, stateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  return response;
}
