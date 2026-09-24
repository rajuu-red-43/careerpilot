import { NextResponse } from 'next/server';
import { getAppBaseUrl } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const isSessionSecretConfigured = Boolean(
    process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32
  );
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const baseUrl = getAppBaseUrl(request);

  return NextResponse.json({
    status: 'ready',
    auth_mode: 'session',
    diagnostics: {
      session_secret_configured: isSessionSecretConfigured,
      supabase_configured: isSupabaseConfigured,
      app_url: baseUrl,
      environment: process.env.NODE_ENV || 'development',
    },
  });
}
