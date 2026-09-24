import { NextResponse } from 'next/server';
import { AUTH_CONFIG, getGoogleRedirectUri, getAppBaseUrl } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const isClientIdConfigured = Boolean(AUTH_CONFIG.googleClientId && AUTH_CONFIG.googleClientId.length > 5);
  const isClientSecretConfigured = Boolean(AUTH_CONFIG.googleClientSecret && AUTH_CONFIG.googleClientSecret.length > 5);
  const isNextAuthSecretConfigured = Boolean(
    process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32
  );

  const redirectUri = getGoogleRedirectUri(request);
  const baseUrl = getAppBaseUrl(request);

  return NextResponse.json({
    status: isClientIdConfigured && isClientSecretConfigured ? 'ready' : 'setup_required',
    diagnostics: {
      GOOGLE_CLIENT_ID_configured: isClientIdConfigured,
      GOOGLE_CLIENT_SECRET_configured: isClientSecretConfigured,
      NEXTAUTH_SECRET_configured: isNextAuthSecretConfigured,
      app_url: baseUrl,
      redirect_uri: redirectUri,
      environment: process.env.NODE_ENV || 'development',
    },
    setup_instructions: (!isClientIdConfigured || !isClientSecretConfigured) ? {
      message: 'Google Cloud authorization is required once.',
      google_cloud_console: 'APIs & Services → Credentials → Create Credentials → OAuth client ID',
      application_type: 'Web application',
      authorized_javascript_origin: 'https://careerpilot-git-main-alpha-8569.vercel.app',
      authorized_redirect_uri: 'https://careerpilot-git-main-alpha-8569.vercel.app/api/auth/callback/google',
      local_redirect_uri: 'http://localhost:3000/api/auth/callback/google',
    } : null,
  });
}
