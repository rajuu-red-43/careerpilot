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
    auth_mode: 'phone_otp',
    diagnostics: {
      phone_otp_active: true,
      session_secret_configured: isSessionSecretConfigured,
      supabase_configured: isSupabaseConfigured,
      app_url: baseUrl,
      environment: process.env.NODE_ENV || 'development',
    },
    flow: {
      step1: 'POST /api/auth/otp/send { phone }',
      step2: 'POST /api/auth/otp/verify { phone, otp, role, preferredLanguage }',
      step3: 'Cookie careerpilot_session created (30 days)',
    },
  });
}
